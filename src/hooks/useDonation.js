// Hook kustom untuk mengakses konteks donasi lokal OpenDonasi.
import { useContext } from 'react';
import { DonationContext } from '../app/context/donationContextInstance';

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation harus digunakan di dalam DonationProvider');
  }
  return context;
}
