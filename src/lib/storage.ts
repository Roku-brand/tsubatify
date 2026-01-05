// Storage utilities for localStorage (metadata) and IndexedDB (audio blobs)

import type { Track, Playlist, Account } from './types';

const ACCOUNTS_KEY = 'tsubatify_accounts';
const CURRENT_ACCOUNT_KEY = 'tsubatify_current_account';
const DEFAULT_ACCOUNT_ID = 'default';

// Keys are prefixed with account ID
function tracksKey(accountId: string): string {
  return `tsubatify_tracks_${accountId}`;
}
function playlistsKey(accountId: string): string {
  return `tsubatify_playlists_${accountId}`;
}
function recentsKey(accountId: string): string {
  return `tsubatify_recents_${accountId}`;
}

const DB_NAME = 'tsubatify_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_blobs';

// ========== localStorage helpers ==========

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage unavailable
  }
}

// ========== Accounts ==========

export function getAccounts(): Account[] {
  const accounts = safeGet<Account[]>(ACCOUNTS_KEY, []);
  // Ensure default account exists
  if (!accounts.some((a) => a.accountId === DEFAULT_ACCOUNT_ID)) {
    const defaultAccount: Account = {
      accountId: DEFAULT_ACCOUNT_ID,
      name: 'デフォルト',
      createdAt: Date.now(),
    };
    accounts.unshift(defaultAccount);
    safeSet(ACCOUNTS_KEY, accounts);
  }
  return accounts;
}

export function setAccounts(accounts: Account[]): void {
  safeSet(ACCOUNTS_KEY, accounts);
}

export function addAccount(account: Account): void {
  const accounts = getAccounts();
  accounts.push(account);
  setAccounts(accounts);
}

export function removeAccount(accountId: string): void {
  if (accountId === DEFAULT_ACCOUNT_ID) return; // Cannot delete default account
  const accounts = getAccounts().filter((a) => a.accountId !== accountId);
  setAccounts(accounts);
  // Clean up account data
  safeRemove(tracksKey(accountId));
  safeRemove(playlistsKey(accountId));
  safeRemove(recentsKey(accountId));
  // If current account is deleted, switch to default
  if (getCurrentAccountId() === accountId) {
    setCurrentAccountId(DEFAULT_ACCOUNT_ID);
  }
}

export function updateAccount(accountId: string, updates: Partial<Account>): void {
  const accounts = getAccounts().map((a) =>
    a.accountId === accountId ? { ...a, ...updates } : a
  );
  setAccounts(accounts);
}

export function getCurrentAccountId(): string {
  return safeGet<string>(CURRENT_ACCOUNT_KEY, DEFAULT_ACCOUNT_ID);
}

export function setCurrentAccountId(accountId: string): void {
  safeSet(CURRENT_ACCOUNT_KEY, accountId);
}

export function getCurrentAccount(): Account | undefined {
  const accountId = getCurrentAccountId();
  return getAccounts().find((a) => a.accountId === accountId);
}

// ========== Tracks ==========

export function getTracks(): Track[] {
  const accountId = getCurrentAccountId();
  return safeGet<Track[]>(tracksKey(accountId), []);
}

export function setTracks(tracks: Track[]): void {
  const accountId = getCurrentAccountId();
  safeSet(tracksKey(accountId), tracks);
}

export function addTrack(track: Track): void {
  const tracks = getTracks();
  tracks.unshift(track);
  setTracks(tracks);
}

export function removeTrack(trackId: string): void {
  const tracks = getTracks().filter((t) => t.trackId !== trackId);
  setTracks(tracks);
}

export function updateTrack(trackId: string, updates: Partial<Track>): void {
  const tracks = getTracks().map((t) =>
    t.trackId === trackId ? { ...t, ...updates } : t
  );
  setTracks(tracks);
}

// ========== Playlists ==========

export function getPlaylists(): Playlist[] {
  const accountId = getCurrentAccountId();
  return safeGet<Playlist[]>(playlistsKey(accountId), []);
}

export function setPlaylists(playlists: Playlist[]): void {
  const accountId = getCurrentAccountId();
  safeSet(playlistsKey(accountId), playlists);
}

export function addPlaylist(playlist: Playlist): void {
  const playlists = getPlaylists();
  playlists.push(playlist);
  setPlaylists(playlists);
}

export function removePlaylist(playlistId: string): void {
  const playlists = getPlaylists().filter((p) => p.playlistId !== playlistId);
  setPlaylists(playlists);
}

export function updatePlaylist(
  playlistId: string,
  updates: Partial<Playlist>
): void {
  const playlists = getPlaylists().map((p) =>
    p.playlistId === playlistId ? { ...p, ...updates, updatedAt: Date.now() } : p
  );
  setPlaylists(playlists);
}

// ========== Recents ==========

const MAX_RECENTS = 50;

export function getRecents(): string[] {
  const accountId = getCurrentAccountId();
  return safeGet<string[]>(recentsKey(accountId), []);
}

export function addRecent(trackId: string): void {
  const accountId = getCurrentAccountId();
  let recents = getRecents().filter((id) => id !== trackId);
  recents.unshift(trackId);
  if (recents.length > MAX_RECENTS) {
    recents = recents.slice(0, MAX_RECENTS);
  }
  safeSet(recentsKey(accountId), recents);
}

// ========== IndexedDB for audio blobs ==========

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveAudioBlob(trackId: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, trackId);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
}

export async function getAudioBlob(trackId: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(trackId);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as Blob) || null);
  });
}

export async function deleteAudioBlob(trackId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(trackId);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
}
