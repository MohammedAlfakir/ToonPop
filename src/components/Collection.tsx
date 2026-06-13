import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { CHARACTERS } from '../data';
import { gsap } from '../lib/gsap';
import Grain from './Grain';

interface CollectionProps {
  onAdd: (index: number) => void;
}

export default function Collection({ onAdd }: CollectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const headEl   = root.querySelector<HTMLElement>('.collection-head')!;
    const headItems = [...headEl.children] as HTMLElement[];
    const gridEl   = root.querySelector<HTMLElement>('.collection-grid')!;
    const cards    = [...root.querySelectorAll<HTMLElement>('.collection-card')];

    const ctx = gsap.context(() => {
      // Capture design opacities (inline styles like 0.7 on the eyebrow)
      // before hiding, so the animation lands exactly on the design value.
      const headOps = headItems.map((el) => (el.style.opacity ? parseFloat(el.style.opacity) : 1));

      // Heading sweeps in from the left, each line a bit deeper
      gsap.fromTo(
        headItems,
        { opacity: 0, x: (i: number) => -40 - i * 30 },
        {
          opacity: (i: number) => headOps[i],
          x: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: headEl, start: 'top 85%', once: true },
        },
      );

      // Cards rise + scale up, then GSAP releases the transform —
      // the CSS hidden state is opacity-only, so nothing snaps back.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.13,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: gridEl, start: 'top 88%', once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collection"
      ref={rootRef}
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#111111' }}
    >
      <Grain />
      <div className="relative px-4 sm:px-24 py-20 sm:py-28" style={{ zIndex: 3 }}>
        <div className="collection-head">
          <p className="eyebrow anim-start" style={{ opacity: 0.7 }}>The Lineup</p>
          <h2 className="anton mt-3 anim-start" style={{ fontSize: 'clamp(44px, 8vw, 120px)' }}>
            Pick Your Crew
          </h2>
          <p className="text-sm mt-4 max-w-md anim-start" style={{ opacity: 0.7, lineHeight: 1.6 }}>
            Four characters, four attitudes. Each figurine is resin-printed, hand-finished and
            shipped in collector-grade packaging.
          </p>
        </div>

        <div className="collection-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-12 sm:mt-16">
          {CHARACTERS.map((character, index) => (
            <div
              key={character.name}
              className="collection-card anim-card group relative rounded-3xl overflow-hidden flex flex-col"
              style={{ backgroundColor: character.panel }}
            >
              <div className="relative h-64 sm:h-72 flex items-end justify-center">
                <span
                  className="anton absolute inset-x-0 text-center text-white select-none pointer-events-none transition-transform duration-300 group-hover:-translate-y-1.5"
                  style={{ top: '8%', fontSize: 'clamp(44px, 4.5vw, 72px)', whiteSpace: 'nowrap', zIndex: 1 }}
                >
                  {character.name}
                </span>
                <img
                  src={character.src}
                  alt={`${character.name} figurine`}
                  draggable={false}
                  className="relative transition-transform duration-300 group-hover:scale-105"
                  style={{
                    height: '120%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    transformOrigin: 'bottom center',
                    marginBottom: '-30%',
                    zIndex: 2,
                  }}
                />
              </div>
              <div className="px-5 sm:px-6 pt-1 pb-5 sm:pb-6 relative" style={{ zIndex: 3 }}>
                <p className="text-xs mb-3" style={{ opacity: 0.9, lineHeight: 1.5 }}>
                  {character.tagline}
                </p>
                <button
                  type="button"
                  onClick={() => onAdd(index)}
                  aria-label={`Add ${character.name} to cart — $${character.price}`}
                  className="card-cta w-full flex items-center justify-between gap-3 rounded-full pl-3 pr-4 py-2"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="card-cta-plus inline-flex items-center justify-center rounded-full">
                      <Plus size={15} strokeWidth={3} />
                    </span>
                    Add to Cart
                  </span>
                  <span className="anton" style={{ fontSize: 24 }}>
                    ${character.price}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
