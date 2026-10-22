// Penyedia state konteks donasi lokal dan riwayat donasi pengguna demo (OpenDonasi).

import { useState, useEffect } from 'react';
import { DonationContext } from './donationContextInstance';
import { INITIAL_USER_DONATIONS, CURRENT_USER } from '../../data/userHistory';

const STORAGE_KEY = 'opendonasi_user_donations';

// Fungsi pembantu untuk memastikan tidak ada duplikasi transaksi berdasarkan ID
function deduplicateTransactions(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    const id = item.transactionId || `item-${Math.random()}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState(() => {
    if (typeof window === 'undefined') {
      return deduplicateTransactions(INITIAL_USER_DONATIONS);
    }
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deduplicateTransactions(parsed);
        }
      }
    } catch {
      // Fallback aman jika data rusak atau sessionStorage tidak dapat diakses
    }
    return deduplicateTransactions(INITIAL_USER_DONATIONS);
  });

  const [currentUser] = useState(CURRENT_USER);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    } catch {
      // Abaikan jika kuota storage terlampaui
    }
  }, [donations]);

  // Tambahkan transaksi baru dengan pencegahan duplikasi
  const addDonation = (newDonation) => {
    if (!newDonation || typeof newDonation !== 'object') return;
    setDonations((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      if (
        newDonation.transactionId &&
        list.some((d) => d && d.transactionId === newDonation.transactionId)
      ) {
        return list;
      }
      return [newDonation, ...list];
    });
  };

  // Kosongkan riwayat donasi (untuk pengujian empty state)
  const clearDonations = () => {
    setDonations([]);
  };

  // Reset riwayat donasi ke dataset dummy awal
  const resetToInitialDonations = () => {
    setDonations(deduplicateTransactions(INITIAL_USER_DONATIONS));
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        addDonation,
        clearDonations,
        resetToInitialDonations,
        currentUser,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

