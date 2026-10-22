// Halaman landing layanan Wakaf OpenDonasi (/wakaf).

import { ServiceLandingPage } from './ServiceLandingPage';
import iconMessages from '../../assets/icons/icons_layanan/messages.svg';

export function WakafPage() {
  return (
    <ServiceLandingPage
      serviceId="wakaf"
      name="Wakaf"
      title="Wakaf Produktif, Bangun Sarana Belajar dan Amal Jariyah"
      subtitle="Wujudkan sarana asrama santri, fasilitas pendidikan Qurani, dan ruang belajar para santri pelosok yang pahalanya terus mengalir abadi."
      icon={iconMessages}
      accentColor="#7C55C7"
      ctaText="Tunaikan Wakaf Sekarang"
      catalogCategory="pendidikan"
      filterFn={(c) => c.serviceType === 'wakaf'}
      pillars={[
        {
          title: 'Pahala Abadi Mengalir',
          description: 'Setiap huruf yang dihafal santri di asrama wakaf menjadi pundi amal jariyah Anda.',
        },
        {
          title: 'Konstruksi Terverifikasi',
          description: 'Pengecoran pondasi dan pengerjaan fisik asrama didokumentasikan bertahap.',
        },
        {
          title: 'Nazhir Terpercaya',
          description: 'Dikelola oleh pengasuh pesantren berdedikasi untuk mencetak generasi berakhlak mulia.',
        },
      ]}
    />
  );
}

export default WakafPage;
