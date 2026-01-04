// Upload Page
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTrack, saveAudioBlob } from '../lib/storage';
import { uuid } from '../lib/utils';
import type { Track } from '../lib/types';

export function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [tags, setTags] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    // Use filename as default title
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        resolve(Math.floor(audio.duration * 1000));
        URL.revokeObjectURL(audio.src);
      };

      audio.onerror = () => {
        resolve(0);
        URL.revokeObjectURL(audio.src);
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!audioFile || !title.trim()) return;

    setUploading(true);

    try {
      const trackId = uuid();

      // Get duration
      const durationMs = await getDuration(audioFile);

      // Read cover as data URL
      let coverDataUrl: string | undefined;
      if (coverFile) {
        coverDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(coverFile);
        });
      }

      // Create track metadata
      const track: Track = {
        trackId,
        title: title.trim(),
        artistName: artist.trim() || 'Unknown Artist',
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        coverDataUrl,
        durationMs,
        createdAt: Date.now(),
      };

      // Save audio blob to IndexedDB
      await saveAudioBlob(trackId, audioFile);

      // Save track metadata to localStorage
      addTrack(track);

      // Reset form
      setTitle('');
      setArtist('');
      setTags('');
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to library
      navigate('/library');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pb-4">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold text-white">音楽をアップロード</h1>
        <p className="text-neutral-400 text-sm mt-1">
          MP3/WAVファイルを選択してください
        </p>
      </header>

      <div className="px-4 space-y-4">
        {/* Audio file input */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            音源ファイル *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/mpeg,.mp3,.wav"
            onChange={handleAudioSelect}
            className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-black hover:file:bg-green-400"
          />
          {audioFile && (
            <div className="mt-2 text-sm text-green-400">
              ✓ {audioFile.name}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            カバー画像（任意）
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🎵</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            タイトル *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="曲のタイトル"
            className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            アーティスト
          </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="アーティスト名"
            className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            タグ（カンマ区切り）
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ジャンル, ムード, テンポ..."
            className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleUpload}
          disabled={!audioFile || !title.trim() || uploading}
          className="w-full py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </div>
    </div>
  );
}
