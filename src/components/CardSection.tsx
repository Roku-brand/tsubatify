// Horizontal Card Section Component
import { useRef } from 'react';

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CardSection({ title, children }: CardSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-white mb-3 px-4">{title}</h2>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  );
}

// Card item for tracks or playlists
interface CardItemProps {
  image?: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
}

export function CardItem({ image, title, subtitle, onClick }: CardItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-36 bg-neutral-900 rounded-lg p-3 hover:bg-neutral-800 transition-colors text-left"
    >
      <div className="w-full aspect-square bg-neutral-800 rounded-md overflow-hidden mb-2">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎵
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-white truncate">{title}</div>
      {subtitle && (
        <div className="text-xs text-neutral-400 truncate">{subtitle}</div>
      )}
    </button>
  );
}

// Playlist card with different styling
interface PlaylistCardProps {
  name: string;
  trackCount: number;
  coverImage?: string;
  onClick: () => void;
}

export function PlaylistCard({
  name,
  trackCount,
  coverImage,
  onClick,
}: PlaylistCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-36 bg-neutral-900 rounded-lg p-3 hover:bg-neutral-800 transition-colors text-left"
    >
      <div className="w-full aspect-square bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-md overflow-hidden mb-2 flex items-center justify-center">
        {coverImage ? (
          <img src={coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📝</span>
        )}
      </div>
      <div className="text-sm font-medium text-white truncate">{name}</div>
      <div className="text-xs text-neutral-400">{trackCount}曲</div>
    </button>
  );
}
