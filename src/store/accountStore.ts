// Account store using Zustand
import { create } from 'zustand';
import type { Account } from '../lib/types';
import {
  getAccounts,
  addAccount as addAccountToStorage,
  removeAccount as removeAccountFromStorage,
  updateAccount as updateAccountInStorage,
  getCurrentAccountId,
  setCurrentAccountId,
  getCurrentAccount,
} from '../lib/storage';
import { uuid } from '../lib/utils';

interface AccountState {
  // Current account
  currentAccountId: string;
  currentAccount: Account | undefined;

  // All accounts
  accounts: Account[];

  // Actions
  refreshAccounts: () => void;
  switchAccount: (accountId: string) => void;
  createAccount: (name: string) => Account;
  deleteAccount: (accountId: string) => void;
  renameAccount: (accountId: string, name: string) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  currentAccountId: getCurrentAccountId(),
  currentAccount: getCurrentAccount(),
  accounts: getAccounts(),

  refreshAccounts: () => {
    set({
      accounts: getAccounts(),
      currentAccountId: getCurrentAccountId(),
      currentAccount: getCurrentAccount(),
    });
  },

  switchAccount: (accountId: string) => {
    setCurrentAccountId(accountId);
    set({
      currentAccountId: accountId,
      currentAccount: getAccounts().find((a) => a.accountId === accountId),
    });
  },

  createAccount: (name: string) => {
    const account: Account = {
      accountId: uuid(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    addAccountToStorage(account);
    set({ accounts: getAccounts() });
    return account;
  },

  deleteAccount: (accountId: string) => {
    removeAccountFromStorage(accountId);
    set({
      accounts: getAccounts(),
      currentAccountId: getCurrentAccountId(),
      currentAccount: getCurrentAccount(),
    });
  },

  renameAccount: (accountId: string, name: string) => {
    updateAccountInStorage(accountId, { name: name.trim() });
    set({
      accounts: getAccounts(),
      currentAccount: getCurrentAccount(),
    });
  },
}));
