// App Component with Router
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BottomTab } from './components/BottomTab';
import { MiniPlayer } from './components/MiniPlayer';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { UploadPage } from './pages/UploadPage';
import { NowPlayingPage } from './pages/NowPlayingPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-28">
      <main className="max-w-2xl mx-auto">{children}</main>
      <MiniPlayer />
      <BottomTab />
      <Toast />
    </div>
  );
}

function NowPlayingLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <NowPlayingPage />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Main routes with bottom tab and mini player */}
        <Route
          path="/home"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/library"
          element={
            <AppLayout>
              <LibraryPage />
            </AppLayout>
          }
        />
        <Route
          path="/playlists"
          element={
            <AppLayout>
              <PlaylistsPage />
            </AppLayout>
          }
        />
        <Route
          path="/playlists/:playlistId"
          element={
            <AppLayout>
              <PlaylistDetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <AppLayout>
              <UploadPage />
            </AppLayout>
          }
        />

        {/* Now playing - full screen without bottom tab */}
        <Route path="/now" element={<NowPlayingLayout />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          }
        />
      </Routes>
    </HashRouter>
  );
}
