// Konfigurasi routing aplikasi OpenDonasi.

import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage';
import { ProgramPage } from '../features/program/ProgramPage';
import { ProgramDetailPage } from '../features/program/ProgramDetailPage';
import { ProgramDonorsPage } from '../features/program/ProgramDonorsPage';
import { ProgramAboutPage } from '../features/program/ProgramAboutPage';
import { ProgramNewsPage } from '../features/program/ProgramNewsPage';
import { SearchPage } from '../features/search/SearchPage';
import { ZakatPage } from '../features/services/ZakatPage';
import { ZakatCalculatorPage } from '../features/services/ZakatCalculatorPage';
import { InfaqPage } from '../features/services/InfaqPage';
import { SedekahPage } from '../features/services/SedekahPage';
import { WakafPage } from '../features/services/WakafPage';
import { DonationFormPage } from '../features/donation/DonationFormPage';
import { DonationResultPage } from '../features/donation/DonationResultPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { DonationHistoryPage } from '../features/profile/DonationHistoryPage';
import { AboutPage } from '../features/info/AboutPage';
import { FaqPage } from '../features/info/FaqPage';
import { ContactPage } from '../features/info/ContactPage';
import { NotFoundPage } from '../features/info/NotFoundPage';
import { OrganizerProfilePage } from '../features/organizer/OrganizerProfilePage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignInPage } from '../features/auth/SignInPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/program/:slug" element={<ProgramDetailPage />} />
      <Route path="/program/:slug/tentang" element={<ProgramAboutPage />} />
      <Route path="/program/:slug/berita" element={<ProgramNewsPage />} />
      <Route path="/program/:slug/donatur" element={<ProgramDonorsPage />} />
      <Route path="/zakat" element={<ZakatPage />} />
      <Route path="/zakat/kalkulator" element={<ZakatCalculatorPage />} />
      <Route path="/zakat/:slug" element={<ProgramDetailPage />} />
      <Route path="/zakat/:slug/tentang" element={<ProgramAboutPage />} />
      <Route path="/zakat/:slug/berita" element={<ProgramNewsPage />} />
      <Route path="/zakat/:slug/donatur" element={<ProgramDonorsPage />} />
      <Route path="/infaq" element={<InfaqPage />} />
      <Route path="/sedekah" element={<SedekahPage />} />
      <Route path="/wakaf" element={<WakafPage />} />
      <Route path="/donasi/:slug" element={<DonationFormPage />} />
      <Route path="/hasil-donasi" element={<DonationResultPage />} />
      <Route path="/tentang" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/kontak" element={<ContactPage />} />
      <Route path="/donasi-saya" element={<DonationHistoryPage />} />
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/daftar" element={<SignInPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/penggalang/:organizerId" element={<OrganizerProfilePage />} />
      <Route path="/yayasan/:organizerId" element={<OrganizerProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
