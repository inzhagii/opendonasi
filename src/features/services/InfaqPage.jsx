// Halaman landing layanan Infaq OpenDonasi (/infaq).

import { ServiceLandingPage } from './ServiceLandingPage';
import iconDevices from '../../assets/icons/icons_layanan/devices.svg';

export function InfaqPage() {
  return (
    <ServiceLandingPage
      serviceId="infaq"
      name="Infaq"
      title="Infaq Kebaikan untuk Kemaslahatan dan Sarana Umat"
      subtitle="Dukung sarana air bersih, renovasi tempat ibadah, dan fasilitas umum di berbagai pelosok nusantara bersama para donatur kebaikan."
      icon={iconDevices}
      accentColor="#0D9488"
      ctaText="Salurkan Infaq Sekarang"
      catalogCategory="kemanusiaan"
      filterFn={(c) => c.serviceType === 'infaq'}
      pillars={[
        {
          title: 'Manfaat Nyata Sarana Ibadah',
          description: 'Mendukung penyediaan sarana bersuci, air bersih, dan renovasi tempat ibadah jamaah.',
        },
        {
          title: 'Laporan Progres Rutin',
          description: 'Pemberian kabar pembaruan konstruksi dan realisasi material secara transparan.',
        },
        {
          title: 'Amanah Pelaksana',
          description: 'Disalurkan melalui panitia desa dan yayasan pelaksana yang diverifikasi OpenDonasi.',
        },
      ]}
    />
  );
}

export default InfaqPage;
