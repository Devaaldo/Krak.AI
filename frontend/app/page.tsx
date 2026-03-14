'use client';

import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import OrbitShowcase from '@/components/home/OrbitShowcase';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <OrbitShowcase />
      <Footer />
    </div>
  );
}
