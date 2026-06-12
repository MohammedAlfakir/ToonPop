import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const ITEMS = ['3D Printed', 'Hand Painted', 'Limited Runs', 'Free Shipping Over $80', 'No Limits'];
// 4 copies so the strip is always wider than any viewport
const COPIES = 4;

export default function Marquee() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Width of a single copy, measured after render
    const singleW = (el.children[0] as HTMLElement).getBoundingClientRect().width;

    // Animate x from 0 toward -singleW; the modifier wraps it so it resets
    // seamlessly without a visible jump — truly infinite.
    const tween = gsap.to(el, {
      x: `-=${singleW}`,
      duration: 22,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleW),
      },
    });

    return () => { tween.kill(); };
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white py-4 sm:py-5">
      <div ref={rowRef} className="flex w-max">
        {Array.from({ length: COPIES }).map((_, copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy > 0}
          >
            {ITEMS.map((item) => (
              <span
                key={item}
                className="anton flex items-center"
                style={{ fontSize: 'clamp(16px, 2.2vw, 26px)' }}
              >
                <span className="px-6 whitespace-nowrap">{item}</span>
                <span style={{ opacity: 0.5 }}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
