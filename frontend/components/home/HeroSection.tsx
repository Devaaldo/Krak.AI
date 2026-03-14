'use client';

import Link from 'next/link';
import ShinyText from '@/animations/ShinyText';
import TrueFocus from '@/animations/TrueFocus';
import TextType from '@/animations/TextType';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white via-white to-surface overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="mb-8">
          <ShinyText
            text="AI-Powered Surface Analysis"
            speed={3}
            className="text-sm font-semibold tracking-widest uppercase"
            color="#94A3B8"
            shineColor="#2563EB"
            spread={120}
          />
        </div>

        {/* Brand */}
        <div className="mb-8">
          <TrueFocus
            sentence="KrakAI"
            manualMode={false}
            blurAmount={4}
            borderColor="#2563EB"
            glowColor="rgba(37, 99, 235, 0.3)"
            animationDuration={0.5}
            pauseBetweenAnimations={2}
          />
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-6 leading-relaxed">
          Detect surface cracks with 99.1% accuracy using Wavelet Transform
          and a lightweight CNN — real-time, interpretable, and precise.
        </p>

        {/* Typewriter */}
        <div className="h-8 mb-12">
          <TextType
            text={[
              "Upload an image for instant analysis",
              "Stream your webcam for live detection",
              "Visualize results with Grad-CAM heatmaps",
            ]}
            typingSpeed={50}
            pauseDuration={2500}
            deletingSpeed={25}
            className="text-base text-muted/70"
            cursorClassName="text-accent"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/detect"
            className="w-full sm:w-auto px-10 py-3.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
          >
            Start Detection
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-10 py-3.5 bg-foreground/5 text-foreground text-sm font-medium rounded-lg hover:bg-foreground/10 transition-all border border-border"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-40 w-[400px] h-[400px] rounded-full bg-accent/[0.02] blur-3xl pointer-events-none" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
