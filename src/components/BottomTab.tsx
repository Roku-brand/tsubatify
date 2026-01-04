// Bottom Tab Navigation
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/home', icon: '🏠', label: 'Home' },
  { to: '/library', icon: '📚', label: 'Library' },
  { to: '/playlists', icon: '📝', label: 'Playlists' },
  { to: '/upload', icon: '📤', label: 'Upload' },
];

export function BottomTab() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 pb-safe z-40">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`
            }
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
