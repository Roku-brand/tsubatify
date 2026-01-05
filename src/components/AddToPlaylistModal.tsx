// Add to Playlist Modal Component
import { useState } from 'react';
import { getPlaylists, updatePlaylist, addPlaylist } from '../lib/storage';
import { uuid } from '../lib/utils';
import type { Playlist } from '../lib/types';
import { usePlayerStore } from '../store/playerStore';

// Playlist Icon (line style)
function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </svg>
  );
}

interface AddToPlaylistModalProps {
  trackId: string;
  trackTitle: string;
  onClose: () => void;
}

export function AddToPlaylistModal({
  trackId,
  trackTitle,
  onClose,
}: AddToPlaylistModalProps) {
  const [playlists] = useState<Playlist[]>(() => getPlaylists());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const showToast = usePlayerStore((state) => state.showToast);

  const handleAddToPlaylist = (playlist: Playlist) => {
    if (playlist.trackIds.includes(trackId)) {
      showToast('この曲は既にプレイリストに追加されています');
      return;
    }

    const newTrackIds = [...playlist.trackIds, trackId];
    updatePlaylist(playlist.playlistId, { trackIds: newTrackIds });
    showToast(`「${playlist.name}」に追加しました`);
    onClose();
  };

  const handleCreateAndAdd = () => {
    if (!newName.trim()) return;

    const playlist: Playlist = {
      playlistId: uuid(),
      name: newName.trim(),
      trackIds: [trackId],
      updatedAt: Date.now(),
    };

    addPlaylist(playlist);
    showToast(`「${playlist.name}」を作成して追加しました`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchEnd={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 rounded-t-2xl max-h-[70vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white">
            プレイリストに追加
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Track info */}
        <div className="px-4 py-3 bg-neutral-800/50 text-sm text-neutral-400">
          曲: <span className="text-white">{trackTitle}</span>
        </div>

        {/* Create new playlist */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sky-400 hover:bg-neutral-800 transition-colors"
          >
            <span className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-2xl">
              +
            </span>
            <span className="font-medium">新しいプレイリストを作成</span>
          </button>
        ) : (
          <div className="p-4 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="プレイリスト名"
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-sky-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-sky-500 text-black font-medium rounded-lg hover:bg-sky-400 transition-colors disabled:opacity-50"
            >
              作成
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewName('');
              }}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Playlist list */}
        <div className="overflow-y-auto max-h-[40vh]">
          {playlists.length > 0 ? (
            playlists.map((playlist) => {
              const isAdded = playlist.trackIds.includes(trackId);
              return (
                <button
                  key={playlist.playlistId}
                  onClick={() => handleAddToPlaylist(playlist)}
                  disabled={isAdded}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    isAdded
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-neutral-800'
                  }`}
                >
                  <span className="w-12 h-12 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center">
                    <PlaylistIcon className="w-6 h-6 text-neutral-300" />
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{playlist.name}</div>
                    <div className="text-sm text-neutral-400">
                      {playlist.trackIds.length}曲
                      {isAdded && ' • 追加済み'}
                    </div>
                  </div>
                  {!isAdded && (
                    <span className="text-sky-400 text-xl">+</span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-400">
              プレイリストがありません
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div className="pb-safe" />
      </div>
    </div>
  );
}
