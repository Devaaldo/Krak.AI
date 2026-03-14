'use client';

import OrbitImages from '@/animations/OrbitImages';
import FadeContent from '@/animations/FadeContent';

const sampleImages = [
  'https://picsum.photos/300/300?grayscale&random=1',
  'https://picsum.photos/300/300?grayscale&random=2',
  'https://picsum.photos/300/300?grayscale&random=3',
  'https://picsum.photos/300/300?grayscale&random=4',
  'https://picsum.photos/300/300?grayscale&random=5',
  'https://picsum.photos/300/300?grayscale&random=6',
];

export default function OrbitShowcase() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <FadeContent blur duration={800}>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Surface Analysis
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            Our model analyzes surface patterns across diverse materials and conditions
          </p>
        </div>

        <OrbitImages
          images={sampleImages}
          shape="ellipse"
          radiusX={340}
          radiusY={80}
          rotation={-8}
          duration={30}
          itemSize={80}
          responsive
          centerContent={
            <div className="w-24 h-24 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/20">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          }
        />
      </FadeContent>
    </section>
  );
}
