// Data models for Tsubatify

export interface Account {
  accountId: string;
  name: string;
  createdAt: number;
}

export interface Track {
  trackId: string;
  title: string;
  artistName: string;
  tags: string[];
  coverDataUrl?: string;
  durationMs?: number;
  createdAt: number;
}

export interface Playlist {
  playlistId: string;
  name: string;
  trackIds: string[];
  coverTrackId?: string;
  updatedAt: number;
}

export type RepeatMode = 'off' | 'one' | 'all';
