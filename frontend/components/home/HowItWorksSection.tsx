'use client';

import ScrollFloat from '@/animations/ScrollFloat';
import FadeContent from '@/animations/FadeContent';

const steps = [
  {
    step: '01',
    title: 'Upload or Stream',
    description: 'Provide a surface image via file upload or connect your webcam for live analysis.',
  },
  {
    step: '02',
    title: 'Wavelet Transform + CNN',
    description: 'The image is processed through a 2-level Haar Wavelet Transform and analyzed by a lightweight CNN with only 24K parameters.',
  },
  {
    step: '03',
    title: 'Get Results',
    description: 'Receive crack/no-crack classification with confidence score and Grad-CAM heatmap showing detected regions.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="px-6 py-24 bg-surface">
      <div className="max-w-4xl mx-auto">
        <ScrollFloat containerClassName="text-center" textClassName="text-3xl font-bold text-foreground">
          How It Works
        </ScrollFloat>

        <div className="mt-16 relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {steps.map((s, i) => (
              <FadeContent key={i} blur duration={600} delay={i * 200}>
                <div className="flex gap-8 items-start relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm relative z-10">
                    {s.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground text-xl mb-2">{s.title}</h3>
                    <p className="text-muted leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
