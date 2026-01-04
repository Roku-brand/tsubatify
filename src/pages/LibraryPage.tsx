// Library Page - All tracks list
import { useState, useMemo } from 'react';
import { TrackRow } from '../components/TrackRow';
import { getTracks, removeTrack as removeTrackFromStorage, deleteAudioBlob } from '../lib/storage';
import { usePlayerStore } from '../store/playerStore';
import type { Track } from '../lib/types';

export function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>(() => getTracks());
  const [search, setSearch] = useState('');
  const { currentTrack, playQueue } = usePlayerStore();

  const filteredTracks = useMemo(() => {
    const query = search.toLowerCase();
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(query) ||
      track.artistName.toLowerCase().includes(query) ||
      track.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [tracks, search]);

  const handlePlay = (trackId: string) => {
    const trackIds = filteredTracks.map((t) => t.trackId);
    const index = trackIds.indexOf(trackId);
    playQueue(trackIds, index);
  };

  const handleDelete = async (trackId: string) => {
    if (!confirm('この曲を削除しますか？')) return;
    
    try {
      await deleteAudioBlob(trackId);
    } catch {
      // Blob may not exist
    }
    removeTrackFromStorage(trackId);
    setTracks(getTracks());
  };

  return (
    <div className="pb-4">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold text-white">ライブラリ</h1>
        <p className="text-neutral-400 text-sm mt-1">
          {tracks.length}曲
        </p>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="曲名、アーティスト、タグで検索..."
          className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
        />
      </div>

      {/* Track list */}
      <div className="px-2">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <TrackRow
              key={track.trackId}
              track={track}
              index={index}
              onPlay={() => handlePlay(track.trackId)}
              onDelete={() => handleDelete(track.trackId)}
              showDelete
              isPlaying={currentTrack?.trackId === track.trackId}
            />
          ))
        ) : (
          <div className="text-center py-12 text-neutral-400">
            {tracks.length === 0
              ? '曲がありません。Uploadから追加してください。'
              : '検索結果がありません'}
          </div>
        )}
      </div>
    </div>
  );
}
