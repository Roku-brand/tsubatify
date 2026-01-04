// Player store using Zustand
import { create } from 'zustand';
import type { Track, RepeatMode } from '../lib/types';
import {
  getTracks,
  getAudioBlob,
  addRecent,
  getRecents,
} from '../lib/storage';

interface PlayerState {
  // Audio element
  audio: HTMLAudioElement;

  // Queue state
  queue: string[]; // trackIds
  queueIndex: number;
  currentTrack: Track | null;

  // Playback state
  isPlaying: boolean;
  currentTimeMs: number;
  durationMs: number;
  shuffle: boolean;
  repeat: RepeatMode;

  // Toast message
  toast: string | null;

  // Actions
  setQueue: (trackIds: string[], startIndex?: number) => void;
  playTrack: (trackId: string) => Promise<void>;
  playQueue: (trackIds: string[], startIndex?: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  togglePlay: () => void;
  seek: (timeMs: number) => void;
  toggleShuffle: () => void;
  setRepeat: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
}

// Create a single audio element
const audio = new Audio();
audio.preload = 'auto';

// Object URL cache for cleanup
let currentObjectUrl: string | null = null;

function revokeCurrentUrl() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Set up audio event listeners
  audio.addEventListener('timeupdate', () => {
    set({ currentTimeMs: audio.currentTime * 1000 });
  });

  audio.addEventListener('durationchange', () => {
    set({ durationMs: audio.duration * 1000 });
  });

  audio.addEventListener('play', () => set({ isPlaying: true }));
  audio.addEventListener('pause', () => set({ isPlaying: false }));

  audio.addEventListener('ended', () => {
    const { repeat, playNext } = get();

    if (repeat === 'one') {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      playNext();
    }
  });

  audio.addEventListener('error', () => {
    const { currentTrack, showToast } = get();
    if (currentTrack) {
      showToast(`再生エラー: ${currentTrack.title}`);
    }
  });

  // Helper to update Media Session
  function updateMediaSession(track: Track | null) {
    if (!('mediaSession' in navigator) || !track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artistName,
      artwork: track.coverDataUrl
        ? [{ src: track.coverDataUrl, sizes: '512x512', type: 'image/jpeg' }]
        : [],
    });
  }

  // Set up Media Session action handlers
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      audio.play().catch(() => {});
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      get().playPrev();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      get().playNext();
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
      }
    });
  }

  async function loadAndPlay(trackId: string): Promise<boolean> {
    const tracks = getTracks();
    const track = tracks.find((t) => t.trackId === trackId);

    if (!track) {
      get().showToast('トラックが見つかりません');
      return false;
    }

    try {
      const blob = await getAudioBlob(trackId);
      if (!blob) {
        get().showToast('音源ファイルが見つかりません');
        return false;
      }

      revokeCurrentUrl();
      const url = URL.createObjectURL(blob);
      currentObjectUrl = url;

      audio.src = url;
      set({ currentTrack: track, durationMs: track.durationMs || 0 });
      updateMediaSession(track);
      addRecent(trackId);

      await audio.play();
      return true;
    } catch {
      get().showToast('再生できませんでした');
      return false;
    }
  }

  return {
    audio,
    queue: [],
    queueIndex: -1,
    currentTrack: null,
    isPlaying: false,
    currentTimeMs: 0,
    durationMs: 0,
    shuffle: false,
    repeat: 'off',
    toast: null,

    setQueue: (trackIds, startIndex = 0) => {
      set({ queue: trackIds, queueIndex: startIndex });
    },

    playTrack: async (trackId) => {
      const tracks = getTracks();
      const allTrackIds = tracks.map((t) => t.trackId);
      const index = allTrackIds.indexOf(trackId);

      if (index === -1) {
        get().showToast('トラックが見つかりません');
        return;
      }

      set({ queue: allTrackIds, queueIndex: index });
      await loadAndPlay(trackId);
    },

    playQueue: async (trackIds, startIndex = 0) => {
      if (trackIds.length === 0) return;

      let finalQueue = [...trackIds];
      let finalIndex = startIndex;

      const { shuffle } = get();
      if (shuffle) {
        // Shuffle but keep the start track at the beginning
        const startTrack = finalQueue[startIndex];
        const rest = finalQueue.filter((_, i) => i !== startIndex);
        // Fisher-Yates shuffle
        for (let i = rest.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rest[i], rest[j]] = [rest[j], rest[i]];
        }
        finalQueue = [startTrack, ...rest];
        finalIndex = 0;
      }

      set({ queue: finalQueue, queueIndex: finalIndex });
      await loadAndPlay(finalQueue[finalIndex]);
    },

    playNext: async () => {
      const { queue, queueIndex, repeat, shuffle } = get();
      if (queue.length === 0) return;

      let nextIndex = queueIndex + 1;

      if (shuffle) {
        // Random next, avoiding same track
        if (queue.length > 1) {
          let attempts = 0;
          do {
            nextIndex = Math.floor(Math.random() * queue.length);
            attempts++;
          } while (nextIndex === queueIndex && attempts < 10);
        }
      }

      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          audio.pause();
          set({ isPlaying: false });
          return;
        }
      }

      set({ queueIndex: nextIndex });
      await loadAndPlay(queue[nextIndex]);
    },

    playPrev: async () => {
      const { queue, queueIndex, repeat } = get();
      if (queue.length === 0) return;

      // If more than 3 seconds into the track, restart it
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      let prevIndex = queueIndex - 1;
      if (prevIndex < 0) {
        if (repeat === 'all') {
          prevIndex = queue.length - 1;
        } else {
          audio.currentTime = 0;
          return;
        }
      }

      set({ queueIndex: prevIndex });
      await loadAndPlay(queue[prevIndex]);
    },

    togglePlay: () => {
      if (audio.src) {
        if (audio.paused) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
    },

    seek: (timeMs) => {
      audio.currentTime = timeMs / 1000;
    },

    toggleShuffle: () => {
      set((state) => ({ shuffle: !state.shuffle }));
    },

    setRepeat: (mode) => {
      set({ repeat: mode });
    },

    cycleRepeat: () => {
      set((state) => {
        const modes: RepeatMode[] = ['off', 'all', 'one'];
        const currentIdx = modes.indexOf(state.repeat);
        const nextIdx = (currentIdx + 1) % modes.length;
        return { repeat: modes[nextIdx] };
      });
    },

    showToast: (message) => {
      set({ toast: message });
      setTimeout(() => {
        set((state) => (state.toast === message ? { toast: null } : {}));
      }, 3000);
    },

    clearToast: () => {
      set({ toast: null });
    },
  };
});

// Export recents helper
export function getRecentTracks(): Track[] {
  const recents = getRecents();
  const tracks = getTracks();
  const trackMap = new Map(tracks.map((t) => [t.trackId, t]));
  return recents
    .map((id) => trackMap.get(id))
    .filter((t): t is Track => t !== undefined);
}
