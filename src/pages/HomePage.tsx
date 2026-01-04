// Home Page
import { useNavigate } from 'react-router-dom';
import { CardSection, CardItem, PlaylistCard } from '../components/CardSection';
import { getTracks, getPlaylists } from '../lib/storage';
import { getRecentTracks } from '../store/playerStore';
import { usePlayerStore } from '../store/playerStore';

export function HomePage() {
  const navigate = useNavigate();
  const playTrack = usePlayerStore((state) => state.playTrack);

  const tracks = getTracks();
  const playlists = getPlaylists();
  const recentTracks = getRecentTracks();

  // Recently added (latest 10)
  const recentlyAdded = tracks.slice(0, 10);

  // Get cover image for playlist from first track
  const getPlaylistCover = (trackIds: string[]): string | undefined => {
    if (trackIds.length === 0) return undefined;
    const track = tracks.find((t) => t.trackId === trackIds[0]);
    return track?.coverDataUrl;
  };

  return (
    <div className="pb-4">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold text-white">おかえりなさい</h1>
        <p className="text-neutral-400 text-sm mt-1">
          今日も音楽を楽しもう
        </p>
      </header>

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <CardSection title="最近追加した曲">
          {recentlyAdded.map((track) => (
            <CardItem
              key={track.trackId}
              image={track.coverDataUrl}
              title={track.title}
              subtitle={track.artistName || 'Unknown Artist'}
              onClick={() => playTrack(track.trackId)}
            />
          ))}
        </CardSection>
      )}

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <CardSection title="最近再生した曲">
          {recentTracks.slice(0, 10).map((track) => (
            <CardItem
              key={track.trackId}
              image={track.coverDataUrl}
              title={track.title}
              subtitle={track.artistName || 'Unknown Artist'}
              onClick={() => playTrack(track.trackId)}
            />
          ))}
        </CardSection>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <CardSection title="プレイリスト">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.playlistId}
              name={playlist.name}
              trackCount={playlist.trackIds.length}
              coverImage={getPlaylistCover(playlist.trackIds)}
              onClick={() => navigate(`/playlists/${playlist.playlistId}`)}
            />
          ))}
        </CardSection>
      )}

      {/* Empty state */}
      {tracks.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h2 className="text-xl font-bold text-white mb-2">
            音楽を追加しよう
          </h2>
          <p className="text-neutral-400 mb-4">
            Uploadタブから音源ファイルをアップロードしてください
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors"
          >
            音楽をアップロード
          </button>
        </div>
      )}
    </div>
  );
}
