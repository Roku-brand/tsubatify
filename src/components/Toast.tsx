// Toast Component
import { usePlayerStore } from '../store/playerStore';

export function Toast() {
  const toast = usePlayerStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-32 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-sm text-center">
        {toast}
      </div>
    </div>
  );
}
