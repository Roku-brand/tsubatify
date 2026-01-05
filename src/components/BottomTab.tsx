// Bottom Tab Navigation
import { NavLink } from 'react-router-dom';

// SVG Line Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="10" rx="1" />
      <rect x="14" y="3" width="7" height="6" rx="1" />
      <rect x="14" y="13" width="7" height="8" rx="1" />
      <rect x="3" y="17" width="7" height="4" rx="1" />
    </svg>
  );
}

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

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

const tabs = [
  { to: '/home', Icon: HomeIcon, label: 'ホーム' },
  { to: '/library', Icon: LibraryIcon, label: '検索' },
  { to: '/playlists', Icon: PlaylistIcon, label: 'プレイリスト' },
  { to: '/upload', Icon: UploadIcon, label: 'アップロード' },
];

export function BottomTab() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-800 z-40 mb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-xl transition-colors ${
                isActive
                  ? 'text-sky-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`
            }
          >
            <tab.Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
