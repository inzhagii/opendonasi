// Halaman landing layanan Sedekah OpenDonasi (/sedekah).

import { ServiceLandingPage } from './ServiceLandingPage';
import iconCourier from '../../assets/icons/icons_layanan/courier-express-.svg';

export function SedekahPage() {
  return (
    <ServiceLandingPage
      serviceId="sedekah"
      name="Sedekah"
      title="Sedekah Rutin, Tebar Kebaikan dan Senyum Dhuafa"
      subtitle="Bantu kebutuhan paket pangan sembako lansia sebatang kara, pengobatan dhuafa, dan nutrisi anak-anak dari keluarga prasejahtera."
      icon={iconCourier}
      accentColor="#E87924"
      ctaText="Sedekah Sekarang"
      catalogCategory="kemanusiaan"
      filterFn={(c) => c.serviceType === 'sedekah'}
      pillars={[
        {
          title: 'Bantuan Langsung Pangan',
          description: 'Penyaluran sembako bergizi untuk kakek-nenek lansia dan keluarga prasejahtera.',
        },
        {
          title: 'Siaga Rutin Kesehatan',
          description: 'Layanan medis dan ambulans gratis bagi warga di perbatasan dan pelosok daerah.',
        },
        {
          title: 'Pencegahan Stunting Balita',
          description: 'Dukungan susu dan paket asupan bergizi demi masa depan generasi sehat nusantara.',
        },
      ]}
    />
  );
}

export default SedekahPage;
