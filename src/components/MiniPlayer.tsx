// Mini Player Component
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { formatTime } from '../lib/utils';

export function MiniPlayer() {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    currentTimeMs,
    durationMs,
    togglePlay,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the play button
    if ((e.target as HTMLElement).closest('button')) return;
    navigate('/now');
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-14 left-0 right-0 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 cursor-pointer z-30"
    >
      {/* Progress bar */}
      <div className="h-1 bg-neutral-800">
        <div
          className="h-full bg-green-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-2">
        {/* Cover */}
        <div className="w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
          {currentTrack.coverDataUrl ? (
            <img
              src={currentTrack.coverDataUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🎵
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-neutral-400 truncate">
            {currentTrack.artistName || 'Unknown Artist'}
          </div>
        </div>

        {/* Time */}
        <div className="text-xs text-neutral-500 hidden sm:block">
          {formatTime(currentTimeMs)}
        </div>

        {/* Play/Pause button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
