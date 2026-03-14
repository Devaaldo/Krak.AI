'use client';

import ScrollFloat from '@/animations/ScrollFloat';
import FadeContent from '@/animations/FadeContent';
import DeveloperCard from '@/components/about/DeveloperCard';

const developers = [
  {
    name: 'Deval',
    role: 'Full-Stack & ML Engineer',
    github: 'https://github.com/Devaaldo',
  },
];

const techStack = [
  { name: 'Next.js', color: 'bg-foreground text-white' },
  { name: 'React', color: 'bg-blue-500 text-white' },
  { name: 'FastAPI', color: 'bg-green-600 text-white' },
  { name: 'PyTorch', color: 'bg-orange-500 text-white' },
  { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
  { name: 'TypeScript', color: 'bg-blue-600 text-white' },
];

export default function AboutPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">About</h1>
        <p className="text-muted text-sm mt-1">The team and technology behind KrakAI</p>
      </div>

      {/* Project description */}
      <FadeContent blur duration={600}>
        <div className="mb-12">
          <ScrollFloat containerClassName="text-left" textClassName="text-xl font-bold text-foreground">
            About KrakAI
          </ScrollFloat>
          <p className="text-muted leading-relaxed mt-4">
            KrakAI is an AI-powered surface crack detection system that combines Discrete Wavelet Transform (DWT)
            preprocessing with a lightweight Convolutional Neural Network. With only 24,082 parameters, the model
            achieves 99.1% accuracy while remaining fast enough for real-time inference on CPU. The system provides
            interpretable results through Grad-CAM heatmap visualization, showing exactly where cracks are detected.
          </p>
        </div>
      </FadeContent>

      {/* Developers */}
      <FadeContent blur duration={600} delay={200}>
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-6">Developer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((dev, i) => (
              <DeveloperCard key={i} developer={dev} />
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Tech Stack */}
      <FadeContent blur duration={600} delay={400}>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </FadeContent>
    </div>
  );
}
