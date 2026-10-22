// Halaman landing layanan Zakat OpenDonasi (/zakat).

import { ServiceLandingPage } from './ServiceLandingPage';
import iconZakat from '../../assets/icons/icons_kategori/zakat.svg';

export function ZakatPage() {
  return (
    <ServiceLandingPage
      serviceId="zakat"
      name="Zakat"
      title="Tunaikan Zakat, Bersihkan Harta dan Berdayakan Mustahik"
      subtitle="Salurkan kewajiban zakat penghasilan dan zakat maal Anda secara transparan melalui lembaga amil zakat yang terverifikasi resmi di platform OpenDonasi."
      icon={iconZakat}
      accentColor="#159947"
      ctaText="Tunaikan Zakat Sekarang"
      catalogCategory="zakat"
      filterFn={(c) => c.serviceType === 'zakat' || c.category === 'zakat'}
      pillars={[
        {
          title: 'Tepat Sasaran 8 Asnaf',
          description: 'Penyaluran ditujukan langsung kepada mustahik yang berhak menerima zakat sesuai syariat.',
        },
        {
          title: 'Kabar Penyaluran Transparan',
          description: 'Setiap penyaluran didokumentasikan dan dilaporkan secara berkala kepada donatur.',
        },
        {
          title: 'Mitra Lembaga Terdaftar',
          description: 'Bekerja sama dengan pengelola zakat resmi yang memiliki akuntabilitas pelaporan teruji.',
        },
      ]}
    />
  );
}

export default ZakatPage;
