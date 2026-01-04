// Track Row Component
import type { Track } from '../lib/types';
import { formatDuration } from '../lib/utils';

interface TrackRowProps {
  track: Track;
  index?: number;
  onPlay: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  isPlaying?: boolean;
}

export function TrackRow({
  track,
  index,
  onPlay,
  onDelete,
  showDelete = false,
  isPlaying = false,
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
