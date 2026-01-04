// Now Playing Page
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';
import { formatTime, formatDuration } from '../lib/utils';

export function NowPlayingPage() {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    currentTimeMs,
    durationMs,
    shuffle,
    repeat,
    queue,
    queueIndex,
    togglePlay,
    playNext,
    playPrev,
    seek,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-xl font-bold text-white mb-2">
          再生中の曲がありません
        </h2>
        <p className="text-neutral-400 mb-4">
          ライブラリから曲を選んでください
        </p>
        <button
          onClick={() => navigate('/library')}
          className="px-6 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors"
        >
          ライブラリへ
        </button>
      </div>
    );
  }

  const progress = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newTime = (value / 100) * durationMs;
    seek(newTime);
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'one':
        return '🔂';
      case 'all':
        return '🔁';
      default:
        return '➡️';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-800 to-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full text-white hover:bg-white/10 flex items-center justify-center"
        >
          ▼
        </button>
        <div className="text-sm text-neutral-400">再生中</div>
        <div className="w-10" />
      </div>

      {/* Cover */}
      <div className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="w-full max-w-sm aspect-square bg-neutral-800 rounded-xl overflow-hidden shadow-2xl">
          {currentTrack.coverDataUrl ? (
            <img
              src={currentTrack.coverDataUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              🎵
            </div>
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="px-8 mb-4">
        <h1 className="text-2xl font-bold text-white truncate">
          {currentTrack.title}
        </h1>
        <p className="text-neutral-400 truncate">
          {currentTrack.artistName || 'Unknown Artist'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-8 mb-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>{formatTime(currentTimeMs)}</span>
          <span>{formatDuration(durationMs)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
              shuffle ? 'text-green-400' : 'text-neutral-400'
            }`}
          >
            🔀
          </button>

          {/* Previous */}
          <button
            onClick={() => playPrev()}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
          >
            ⏮
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-3xl hover:scale-105 transition-transform"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Next */}
          <button
            onClick={() => playNext()}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl hover:bg-white/10 transition-colors"
          >
            ⏭
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
              repeat !== 'off' ? 'text-green-400' : 'text-neutral-400'
            }`}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Queue info */}
        <div className="text-center text-sm text-neutral-500">
          {queueIndex + 1} / {queue.length}曲
        </div>
      </div>
    </div>
  );
}
