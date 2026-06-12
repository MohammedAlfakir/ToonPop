import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export interface ToastData {
  id: number;
  msg: string;
}

export default function Toast({ toast }: { toast: ToastData | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!toast || !el) return;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { xPercent: -50, y: 80, opacity: 0 },
      { xPercent: -50, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' },
    ).to(el, { y: 80, opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=1.8');
    return () => {
      tl.kill();
    };
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      ref={ref}
      className="fixed bottom-8 left-1/2 z-[300] bg-white text-black px-6 py-3 rounded-full text-xs font-semibold uppercase shadow-xl pointer-events-none whitespace-nowrap"
      style={{ letterSpacing: '0.12em', opacity: 0 }}
    >
      {toast.msg}
    </div>
  );
}
