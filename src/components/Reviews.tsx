import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { REVIEWS } from '../data';
import { gsap } from '../lib/gsap';
import Grain from './Grain';

export default function Reviews() {
  const rootRef   = useRef<HTMLElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const quoteRef  = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const root  = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const items = [...inner.children] as HTMLElement[];

    const ctx = gsap.context(() => {
      const [eyebrow, title, quote, controls] = items;
      const eyebrowOp = eyebrow.style.opacity ? parseFloat(eyebrow.style.opacity) : 1;

      // Hide everything NOW — tweens inside a triggered timeline only apply
      // their from-states when the trigger fires, which would flash content.
      gsap.set([eyebrow, title, quote], { opacity: 0 });
      // The container stays visible; its buttons are what animate in.
      gsap.set(controls, { opacity: 1 });
      gsap.set([...controls.children], { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      });
      // Title block sweeps in from the right, quote floats up,
      // arrow buttons pop in one after the other.
      tl.fromTo(eyebrow, { x: 60, opacity: 0 }, { x: 0, opacity: eyebrowOp, duration: 0.6, clearProps: 'transform' })
        .fromTo(title, { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, clearProps: 'transform' }, 0.08)
        .fromTo(quote, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, clearProps: 'transform' }, 0.25)
        .fromTo(
          [...controls.children],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform' },
          0.4,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  const go = (dir: 'next' | 'prev') => {
    const el = quoteRef.current;
    if (animating.current || !el) return;
    animating.current = true;
    const outX = dir === 'next' ? -50 : 50;
    gsap.to(el, {
      opacity: 0,
      x: outX,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        setIndex((i) =>
          dir === 'next' ? (i + 1) % REVIEWS.length : (i + REVIEWS.length - 1) % REVIEWS.length,
        );
        gsap.fromTo(
          el,
          { opacity: 0, x: -outX },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
            clearProps: 'transform',
            onComplete: () => { animating.current = false; },
          },
        );
      },
    });
  };

  const review = REVIEWS[index];

  return (
    <section
      id="reviews"
      ref={rootRef}
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#E882B4' }}
    >
      <Grain />
      <div
        ref={innerRef}
        className="relative px-4 sm:px-24 py-20 sm:py-28 flex flex-col items-center text-center"
        style={{ zIndex: 3 }}
      >
        <p className="eyebrow anim-start" style={{ opacity: 0.85 }}>Reviews</p>
        <h2 className="anton mt-3 anim-start" style={{ fontSize: 'clamp(44px, 8vw, 120px)' }}>
          Crew Love
        </h2>

        <div ref={quoteRef} className="mt-10 sm:mt-14 max-w-3xl anim-start">
          <p className="text-lg sm:text-2xl font-medium" style={{ lineHeight: 1.5, opacity: 0.95 }}>
            "{review.quote}"
          </p>
          <p className="anton mt-8" style={{ fontSize: 24 }}>{review.name}</p>
          <p className="eyebrow mt-2" style={{ opacity: 0.8 }}>{review.role}</p>
        </div>

        <div className="flex items-center gap-3 mt-10 sm:mt-12 anim-start">
          <button type="button" aria-label="Previous review" onClick={() => go('prev')} className="btn-circle w-12 h-12 sm:w-14 sm:h-14">
            <ArrowLeft size={22} strokeWidth={2.25} />
          </button>
          <button type="button" aria-label="Next review" onClick={() => go('next')} className="btn-circle w-12 h-12 sm:w-14 sm:h-14">
            <ArrowRight size={22} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </section>
  );
}
