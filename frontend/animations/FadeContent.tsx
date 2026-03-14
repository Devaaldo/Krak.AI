'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';

interface FadeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 1000,
  ease = 'power2.out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const startPct = (1 - threshold) * 100;
      const getSeconds = (val: number) => (val > 10 ? val / 1000 : val);

      gsap.set(el, {
        autoAlpha: initialOpacity,
        filter: blur ? 'blur(10px)' : 'blur(0px)',
        willChange: 'opacity, filter, transform'
      });

      const tl = gsap.timeline({
        paused: true,
        delay: getSeconds(delay),
      });

      tl.to(el, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: getSeconds(duration),
        ease: ease
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: `top ${startPct}%`,
        once: true,
        onEnter: () => tl.play()
      });

      cleanup = () => {
        st.kill();
        tl.kill();
        gsap.killTweensOf(el);
      };
    })();

    return () => cleanup?.();
  }, [blur, duration, ease, delay, threshold, initialOpacity]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
};

export default FadeContent;
