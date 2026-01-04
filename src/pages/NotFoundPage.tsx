// 404 Not Found Page
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold text-white mb-2">404</h1>
      <p className="text-neutral-400 mb-6">
        お探しのページは見つかりませんでした
      </p>
      <button
        onClick={() => navigate('/home')}
        className="px-6 py-2 bg-green-500 text-black font-medium rounded-full hover:bg-green-400 transition-colors"
      >
        ホームへ戻る
      </button>
    </div>
  );
}
