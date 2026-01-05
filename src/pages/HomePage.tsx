// Home Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardSection, CardItem, PlaylistCard } from '../components/CardSection';
import { AccountModal, SettingsButton } from '../components/AccountModal';
import { getTracks, getPlaylists } from '../lib/storage';
import { getRecentTracks } from '../store/playerStore';
import { usePlayerStore } from '../store/playerStore';
import { useAccountStore } from '../store/accountStore';

export function HomePage() {
  const navigate = useNavigate();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentAccount = useAccountStore((state) => state.currentAccount);
  const [showAccountModal, setShowAccountModal] = useState(false);

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
    <div className="pb-4 pt-4">
      {/* Header with settings button */}
      <div className="flex items-center justify-between px-4 mb-4">
        <SettingsButton onClick={() => setShowAccountModal(true)} />
        <span className="text-sm text-neutral-400">
          {currentAccount?.name || 'デフォルト'}
        </span>
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

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
            className="px-6 py-2 bg-sky-500 text-black font-medium rounded-full hover:bg-sky-400 transition-colors"
          >
            音楽をアップロード
          </button>
        </div>
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal onClose={() => setShowAccountModal(false)} />
      )}
    </div>
  );
}
