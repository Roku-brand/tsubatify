// Playlist Detail Page
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrackRow } from '../components/TrackRow';
import { getPlaylists, updatePlaylist, getTracks } from '../lib/storage';
import { usePlayerStore } from '../store/playerStore';
import type { Playlist, Track } from '../lib/types';

function findPlaylist(playlistId: string | undefined): Playlist | null {
  if (!playlistId) return null;
  const playlists = getPlaylists();
  return playlists.find((p) => p.playlistId === playlistId) || null;
}

export function PlaylistDetailPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { currentTrack, playQueue } = usePlayerStore();

  const [playlist, setPlaylist] = useState<Playlist | null>(() => findPlaylist(playlistId));
  const [allTracks] = useState<Track[]>(() => getTracks());
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  if (!playlist) {
    return (
      <div className="p-4 text-center text-neutral-400">
        プレイリストが見つかりません
        <button
          onClick={() => navigate('/playlists')}
          className="block mx-auto mt-4 text-green-400"
        >
          戻る
        </button>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds
    .map((id) => allTracks.find((t) => t.trackId === id))
    .filter((t): t is Track => t !== undefined);

  const availableTracks = allTracks.filter(
    (t) =>
      !playlist.trackIds.includes(t.trackId) &&
      (t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.artistName.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePlay = (trackId: string) => {
    const trackIds = playlist.trackIds;
    const index = trackIds.indexOf(trackId);
    playQueue(trackIds, index);
  };

  const handlePlayAll = () => {
    if (playlist.trackIds.length === 0) return;
    playQueue(playlist.trackIds, 0);
  };

  const handleAddTrack = (trackId: string) => {
    const newTrackIds = [...playlist.trackIds, trackId];
    updatePlaylist(playlist.playlistId, { trackIds: newTrackIds });
    setPlaylist({ ...playlist, trackIds: newTrackIds });
  };

  const handleRemoveTrack = (trackId: string) => {
    const newTrackIds = playlist.trackIds.filter((id) => id !== trackId);
    updatePlaylist(playlist.playlistId, { trackIds: newTrackIds });
    setPlaylist({ ...playlist, trackIds: newTrackIds });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTrackIds = [...playlist.trackIds];
    [newTrackIds[index - 1], newTrackIds[index]] = [
      newTrackIds[index],
      newTrackIds[index - 1],
    ];
    updatePlaylist(playlist.playlistId, { trackIds: newTrackIds });
    setPlaylist({ ...playlist, trackIds: newTrackIds });
  };

  const handleMoveDown = (index: number) => {
    if (index === playlist.trackIds.length - 1) return;
    const newTrackIds = [...playlist.trackIds];
    [newTrackIds[index], newTrackIds[index + 1]] = [
      newTrackIds[index + 1],
      newTrackIds[index],
    ];
    updatePlaylist(playlist.playlistId, { trackIds: newTrackIds });
    setPlaylist({ ...playlist, trackIds: newTrackIds });
  };

  const coverImage = playlistTracks[0]?.coverDataUrl;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 py-6 flex gap-4 items-end">
        {/* Cover */}
        <div className="w-24 h-24 bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
          {coverImage ? (
            <img src={coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">📝</span>
          )}
        </div>

        <div className="flex-1">
          <div className="text-xs text-neutral-400 mb-1">プレイリスト</div>
          <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
          <div className="text-sm text-neutral-400 mt-1">
            {playlist.trackIds.length}曲
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-4 flex gap-2">
        <button
          onClick={handlePlayAll}
          disabled={playlist.trackIds.length === 0}
          className="px-6 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors disabled:opacity-50"
        >
          ▶ 再生
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 border border-neutral-600 text-white rounded-full hover:border-white transition-colors"
        >
          + 曲を追加
        </button>
      </div>

      {/* Add track modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex flex-col z-50">
          <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
            <h2 className="text-lg font-bold text-white">曲を追加</h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setSearch('');
              }}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="p-4 bg-neutral-900">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="曲を検索..."
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto bg-neutral-950 px-2">
            {availableTracks.length > 0 ? (
              availableTracks.map((track) => (
                <div
                  key={track.trackId}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-800/50 rounded-lg"
                >
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {track.title}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {track.artistName || 'Unknown Artist'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddTrack(track.trackId)}
                    className="px-3 py-1 text-green-400 border border-green-400 rounded-full text-sm hover:bg-green-400 hover:text-black transition-colors"
                  >
                    追加
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">
                {allTracks.length === 0
                  ? '曲がありません'
                  : '追加できる曲がありません'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Track list */}
      <div className="px-2">
        {playlistTracks.length > 0 ? (
          playlistTracks.map((track, index) => (
            <div key={track.trackId} className="flex items-center gap-1">
              {/* Reorder buttons */}
              <div className="flex flex-col">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="text-xs text-neutral-500 hover:text-white disabled:opacity-30 px-1"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === playlistTracks.length - 1}
                  className="text-xs text-neutral-500 hover:text-white disabled:opacity-30 px-1"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1">
                <TrackRow
                  track={track}
                  index={index}
                  onPlay={() => handlePlay(track.trackId)}
                  onDelete={() => handleRemoveTrack(track.trackId)}
                  showDelete
                  isPlaying={currentTrack?.trackId === track.trackId}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-neutral-400">
            プレイリストに曲がありません
          </div>
        )}
      </div>
    </div>
  );
}
