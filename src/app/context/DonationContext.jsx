import { useState, useEffect } from 'react';
import { DonationContext } from './donationContextInstance';
import { INITIAL_USER_DONATIONS, CURRENT_USER } from '../../data/userHistory';

const STORAGE_KEY = 'opendonasi_user_donations';

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback jika storage tidak tersedia
    }
    return INITIAL_USER_DONATIONS;
  });

  const [currentUser] = useState(CURRENT_USER);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    } catch {
      // Abaikan jika quota storage terlampaui
    }
  }, [donations]);

  const addDonation = (newDonation) => {
    setDonations((prev) => [newDonation, ...prev]);
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation, currentUser }}>
      {children}
    </DonationContext.Provider>
  );
}
