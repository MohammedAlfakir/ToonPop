import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 h-[3px] z-[300] pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-white"
        style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
      />
    </div>
  );
}
