import { useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { HeroCarousel } from '../../components/campaign/HeroCarousel';
import { QuickServiceBar } from '../../components/campaign/QuickServiceBar';
import { FeaturedCampaignCarousel } from '../../components/campaign/FeaturedCampaignCarousel';
import { PosterCarousel } from '../../components/campaign/PosterCarousel';
import { CategoryProgramSection } from '../../components/campaign/CategoryProgramSection';
import { PrayerCarousel } from '../../components/campaign/PrayerCarousel';
import { ClosingCta } from '../../components/campaign/ClosingCta';

/**
 * 01. Beranda (HomePage) OpenDonasi
 * Mengimplementasikan 7 seksi konten Beranda sesuai OPENDONASI_SPEC:
 * 1. Hero banner carousel (16:9, swipe/drag, autoplay 6s, no arrow).
 * 2. Akses cepat layanan (5 pilihan: Donasi, Zakat, Infaq, Sedekah, Wakaf).
 * 3. Section "Ada Kebaikan yang Menantimu" (program unggulan carousel).
 * 4. Section "Yang Baru di OpenDonasi" (poster/banner carousel 16:9).
 * 5. Section program dengan kategori ikon dan responsive grid.
 * 6. Section "Dukungan & Doa Orang Baik" (doa donatur + tombol Aamiin toggle lokal).
 * 7. Section CTA penutup.
 */
export function HomePage() {
  // Update document title untuk SEO & aksesibilitas
  useEffect(() => {
    document.title = 'OpenDonasi — Digital Giving Infrastructure';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex flex-col py-4 sm:py-6 md:py-8 space-y-10 sm:space-y-12 md:space-y-16">
      {/* 1. Hero Banner Carousel */}
      <Container>
        <HeroCarousel />
      </Container>

      {/* 2. Akses Cepat Layanan */}
      <Container>
        <QuickServiceBar />
      </Container>

      {/* 3. Section "Ada Kebaikan yang Menantimu" (Program Unggulan) */}
      <Container>
        <FeaturedCampaignCarousel />
      </Container>

      {/* 4. Section "Yang Baru di OpenDonasi" (Poster Carousel) */}
      <Container>
        <PosterCarousel />
      </Container>

      {/* 5. Section Program dengan Kategori & Grid Responsif */}
      <Container>
        <CategoryProgramSection />
      </Container>

      {/* 6. Section "Dukungan & Doa Orang Baik" */}
      <Container>
        <PrayerCarousel />
      </Container>

      {/* 7. CTA Penutup */}
      <Container>
        <ClosingCta />
      </Container>
    </div>
  );
}

export default HomePage;
