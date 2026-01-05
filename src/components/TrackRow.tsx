// Track Row Component
import type { Track } from '../lib/types';
import { formatDuration } from '../lib/utils';

// Add to Playlist Icon
function AddToPlaylistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="16" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
      <line x1="19" y1="15" x2="19" y2="21" />
      <line x1="16" y1="18" x2="22" y2="18" />
    </svg>
  );
}

interface TrackRowProps {
  track: Track;
  index?: number;
  onPlay: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  isPlaying?: boolean;
  onAddToPlaylist?: () => void;
  showAddToPlaylist?: boolean;
}

export function TrackRow({
  track,
  index,
  onPlay,
  onDelete,
  showDelete = false,
  isPlaying = false,
  onAddToPlaylist,
  showAddToPlaylist = false,
}: TrackRowProps) {
  return (
    <div
      onClick={onPlay}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isPlaying
          ? 'bg-neutral-800'
          : 'hover:bg-neutral-800/50'
      }`}
    >
      {/* Index or Play indicator */}
      {index !== undefined && (
        <span className="w-6 text-center text-sm text-neutral-500">
          {isPlaying ? (
            <span className="text-green-400">▶</span>
          ) : (
            index + 1
          )}
        </span>
      )}

      {/* Cover */}
      <div className="w-10 h-10 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
        {track.coverDataUrl ? (
          <img
            src={track.coverDataUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            🎵
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium truncate ${
            isPlaying ? 'text-green-400' : 'text-white'
          }`}
        >
          {track.title}
        </div>
        <div className="text-xs text-neutral-400 truncate">
          {track.artistName || 'Unknown Artist'}
        </div>
      </div>

      {/* Duration */}
      <span className="text-xs text-neutral-500">
        {formatDuration(track.durationMs)}
      </span>

      {/* Add to Playlist button */}
      {showAddToPlaylist && onAddToPlaylist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist();
          }}
          className="w-8 h-8 rounded-full text-neutral-400 hover:text-green-400 hover:bg-neutral-800 flex items-center justify-center transition-colors"
          title="プレイリストに追加"
        >
          <AddToPlaylistIcon className="w-5 h-5" />
        </button>
      )}

      {/* Delete button */}
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-8 h-8 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-800 flex items-center justify-center transition-colors"
          title="削除"
        >
          ✕
        </button>
      )}
    </div>
  );
}
