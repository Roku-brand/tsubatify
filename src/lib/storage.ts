// Storage utilities for localStorage (metadata) and IndexedDB (audio blobs)

import type { Track, Playlist } from './types';

const TRACKS_KEY = 'tsubatify_tracks';
const PLAYLISTS_KEY = 'tsubatify_playlists';
const RECENTS_KEY = 'tsubatify_recents';
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

// ========== Tracks ==========

export function getTracks(): Track[] {
  return safeGet<Track[]>(TRACKS_KEY, []);
}

export function setTracks(tracks: Track[]): void {
  safeSet(TRACKS_KEY, tracks);
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
  return safeGet<Playlist[]>(PLAYLISTS_KEY, []);
}

export function setPlaylists(playlists: Playlist[]): void {
  safeSet(PLAYLISTS_KEY, playlists);
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
  return safeGet<string[]>(RECENTS_KEY, []);
}

export function addRecent(trackId: string): void {
  let recents = getRecents().filter((id) => id !== trackId);
  recents.unshift(trackId);
  if (recents.length > MAX_RECENTS) {
    recents = recents.slice(0, MAX_RECENTS);
  }
  safeSet(RECENTS_KEY, recents);
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
