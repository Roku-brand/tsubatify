// Playlists Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPlaylists,
  addPlaylist,
  removePlaylist,
  getTracks,
} from '../lib/storage';
import { uuid } from '../lib/utils';
import type { Playlist, Track } from '../lib/types';

export function PlaylistsPage() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>(() => getPlaylists());
  const [tracks] = useState<Track[]>(() => getTracks());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const getPlaylistCover = (trackIds: string[]): string | undefined => {
    if (trackIds.length === 0) return undefined;
    const track = tracks.find((t) => t.trackId === trackIds[0]);
    return track?.coverDataUrl;
  };

  const handleCreate = () => {
    if (!newName.trim()) return;

    const playlist: Playlist = {
      playlistId: uuid(),
      name: newName.trim(),
      trackIds: [],
      updatedAt: Date.now(),
    };

    addPlaylist(playlist);
    setPlaylists(getPlaylists());
    setNewName('');
    setShowCreate(false);
  };

  const handleDelete = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('このプレイリストを削除しますか？')) return;

    removePlaylist(playlistId);
    setPlaylists(getPlaylists());
  };

  return (
    <div className="pb-4">
      <header className="px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">プレイリスト</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {playlists.length}個のプレイリスト
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors"
        >
          + 作成
        </button>
      </header>

      {/* Create playlist modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-white mb-4">
              新しいプレイリスト
            </h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="プレイリスト名"
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors disabled:opacity-50"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist list */}
      <div className="px-4 space-y-2">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <button
              key={playlist.playlistId}
              onClick={() => navigate(`/playlists/${playlist.playlistId}`)}
              className="w-full flex items-center gap-4 p-3 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {/* Cover */}
              <div className="w-14 h-14 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                {getPlaylistCover(playlist.trackIds) ? (
                  <img
                    src={getPlaylistCover(playlist.trackIds)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📝</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{playlist.name}</div>
                <div className="text-sm text-neutral-400">
                  {playlist.trackIds.length}曲
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(playlist.playlistId, e)}
                className="w-10 h-10 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-700 flex items-center justify-center transition-colors"
                title="削除"
              >
                🗑
              </button>
            </button>
          ))
        ) : (
          <div className="text-center py-12 text-neutral-400">
            プレイリストがありません
          </div>
        )}
      </div>
    </div>
  );
}
