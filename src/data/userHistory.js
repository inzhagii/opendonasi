/**
 * Data mock terpusat untuk riwayat donasi pengguna demo dan profil akun
 * Status: Data demonstrasi prototype
 */

import img3 from '../assets/image/gambar/gambar3.png';
import img1 from '../assets/image/gambar/gambar1.png';

export const CURRENT_USER = {
  id: 'user-demo-001',
  name: 'Donatur Demo',
  email: 'donatur.demo@opendonasi.id.demo',
  avatarUrl: null,
  isDemoAccount: true,
};

export const INITIAL_USER_DONATIONS = [
  {
    transactionId: 'OD-884920',
    campaignId: 'camp-001',
    campaignTitle: 'Bangun Pesantren Bangun Peradaban Santri Pelosok',
    campaignSlug: 'bantu-sarana-belajar-pesantren',
    campaignImage: img3,
    serviceType: 'wakaf',
    amount: 150000,
    date: '2026-04-01',
    status: 'success', // 'success' = Berhasil (Simulasi)
    isAnonymous: false,
    donorName: 'Donatur Demo',
    paymentMethod: 'QRIS (Simulasi)',
  },
  {
    transactionId: 'OD-884102',
    campaignId: 'camp-002',
    campaignTitle: 'Tanggap Darurat dan Dapur Umum Warga Terdampak',
    campaignSlug: 'tanggap-darurat-korban-bencana',
    campaignImage: img1,
    serviceType: 'donasi',
    amount: 50000,
    date: '2026-03-28',
    status: 'pending', // 'pending' = Menunggu Pembayaran (tidak boleh disebut berhasil)
    isAnonymous: true,
    donorName: 'Hamba Allah',
    paymentMethod: 'Bank Transfer (Simulasi)',
  },
];
