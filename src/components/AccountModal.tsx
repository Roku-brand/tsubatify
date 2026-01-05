// Account Modal Component
import { useState } from 'react';
import { useAccountStore } from '../store/accountStore';

// Settings gear icon (line style)
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

// User icon
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Trash icon
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

// Edit icon
function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

interface AccountModalProps {
  onClose: () => void;
}

export function AccountModal({ onClose }: AccountModalProps) {
  const {
    accounts,
    currentAccountId,
    switchAccount,
    createAccount,
    deleteAccount,
    updateAccount,
  } = useAccountStore();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Settings editing state
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editArtistName, setEditArtistName] = useState('');

  const handleStartEdit = (accountId: string) => {
    const account = accounts.find((a) => a.accountId === accountId);
    if (account) {
      setEditName(account.name);
      setEditArtistName(account.defaultArtistName || '');
      setEditingAccountId(accountId);
      setShowCreate(false);
      setConfirmDelete(null);
    }
  };

  const handleSaveSettings = () => {
    if (!editingAccountId || !editName.trim()) return;
    updateAccount(editingAccountId, {
      name: editName.trim(),
      defaultArtistName: editArtistName.trim() || undefined,
    });
    setEditingAccountId(null);
    setEditName('');
    setEditArtistName('');
  };

  const handleCancelEdit = () => {
    setEditingAccountId(null);
    setEditName('');
    setEditArtistName('');
  };

  const handleCreateAccount = () => {
    if (!newName.trim()) return;
    const account = createAccount(newName);
    switchAccount(account.accountId);
    setNewName('');
    setShowCreate(false);
    onClose();
    // Force page reload to refresh data with new account
    window.location.reload();
  };

  const handleSwitchAccount = (accountId: string) => {
    if (accountId === currentAccountId) return;
    switchAccount(accountId);
    onClose();
    // Force page reload to refresh data with new account
    window.location.reload();
  };

  const handleDeleteAccount = (accountId: string) => {
    const wasCurrentAccount = accountId === currentAccountId;
    deleteAccount(accountId);
    setConfirmDelete(null);
    if (wasCurrentAccount) {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchEnd={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-neutral-900 rounded-t-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-bold text-white">アカウント管理</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Current account info */}
        <div className="px-4 py-3 bg-neutral-800/50 text-sm text-neutral-400">
          現在のアカウント:{' '}
          <span className="text-green-400 font-medium">
            {accounts.find((a) => a.accountId === currentAccountId)?.name ||
              '不明'}
          </span>
        </div>

        {/* Create new account */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-green-400 hover:bg-neutral-800 transition-colors"
          >
            <span className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-2xl">
              +
            </span>
            <span className="font-medium">新しいアカウントを作成</span>
          </button>
        ) : (
          <div className="p-4 flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="アカウント名"
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateAccount();
                if (e.key === 'Escape') {
                  setShowCreate(false);
                  setNewName('');
                }
              }}
            />
            <button
              onClick={handleCreateAccount}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              作成
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewName('');
              }}
              className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Account list */}
        <div className="overflow-y-auto max-h-[50vh]">
          {accounts.map((account) => {
            const isCurrentAccount = account.accountId === currentAccountId;
            const isDefaultAccount = account.accountId === 'default';
            const isConfirmingDelete = confirmDelete === account.accountId;
            const isEditing = editingAccountId === account.accountId;

            // Show edit form if this account is being edited
            if (isEditing) {
              return (
                <div
                  key={account.accountId}
                  className="px-4 py-3 bg-neutral-800/50 space-y-3"
                >
                  <div className="text-sm text-neutral-400 font-medium">
                    アカウント設定を編集
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      アカウント名
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="アカウント名"
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      デフォルトアーティスト名
                    </label>
                    <input
                      type="text"
                      value={editArtistName}
                      onChange={(e) => setEditArtistName(e.target.value)}
                      placeholder="アップロード時のデフォルト名"
                      className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={!editName.trim()}
                      className="px-4 py-1.5 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50"
                    >
                      保存
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={account.accountId}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isCurrentAccount ? 'bg-neutral-800/50' : 'hover:bg-neutral-800'
                }`}
              >
                <button
                  onClick={() => handleSwitchAccount(account.accountId)}
                  className="flex items-center gap-3 flex-1"
                  disabled={isCurrentAccount}
                >
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCurrentAccount
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <UserIcon className="w-6 h-6" />
                  </span>
                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${
                        isCurrentAccount ? 'text-green-400' : 'text-white'
                      }`}
                    >
                      {account.name}
                      {isCurrentAccount && (
                        <span className="ml-2 text-xs text-green-400/70">
                          (使用中)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {account.defaultArtistName
                        ? `🎤 ${account.defaultArtistName}`
                        : new Date(account.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </button>

                {/* Edit and Delete buttons */}
                <div className="flex items-center">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">削除？</span>
                      <button
                        onClick={() => handleDeleteAccount(account.accountId)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-400 transition-colors"
                      >
                        はい
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 bg-neutral-700 text-white text-xs rounded hover:bg-neutral-600 transition-colors"
                      >
                        いいえ
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Edit button */}
                      <button
                        onClick={() => handleStartEdit(account.accountId)}
                        className="p-2 text-neutral-500 hover:text-green-400 transition-colors"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      {/* Delete button (not for default account) */}
                      {!isDefaultAccount && (
                        <button
                          onClick={() => setConfirmDelete(account.accountId)}
                          className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom safe area */}
        <div className="pb-safe" />
      </div>
    </div>
  );
}

// Settings button for the HomePage
export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-neutral-400 hover:text-white transition-colors"
      aria-label="設定"
    >
      <SettingsIcon className="w-6 h-6" />
    </button>
  );
}
