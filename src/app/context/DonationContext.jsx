import { useState, useEffect } from 'react';
import { DonationContext } from './donationContextInstance';
import { INITIAL_USER_DONATIONS, CURRENT_USER } from '../../data/userHistory';

const STORAGE_KEY = 'opendonasi_user_donations';

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState(() => {
    if (typeof window === 'undefined') {
      return INITIAL_USER_DONATIONS;
    }
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback aman jika data rusak atau sessionStorage tidak dapat diakses
    }
    return INITIAL_USER_DONATIONS;
  });

  const [currentUser] = useState(CURRENT_USER);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    } catch {
      // Abaikan jika kuota storage terlampaui
    }
  }, [donations]);

  const addDonation = (newDonation) => {
    if (!newDonation || typeof newDonation !== 'object') return;
    setDonations((prev) => [newDonation, ...(Array.isArray(prev) ? prev : [])]);
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation, currentUser }}>
      {children}
    </DonationContext.Provider>
  );
}
