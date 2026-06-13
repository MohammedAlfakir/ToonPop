import { useEffect, useRef } from 'react';
import { STATS } from '../data';
import { gsap } from '../lib/gsap';

const STEPS = [
  {
    num: '01',
    title: 'Sculpted',
    color: '#F4845F',
    desc: 'Every character starts as a digital sculpt — we obsess over each fabric fold, lace and chain link before anything gets printed.',
  },
  {
    num: '02',
    title: 'Printed',
    color: '#6BBF7A',
    desc: 'Resin-printed at 50-micron layer height for razor-sharp edges. No visible layer lines, even on the smallest graffiti tag.',
  },
  {
    num: '03',
    title: 'Painted',
    color: '#E882B4',
    desc: 'Hand-painted with a matte, museum-grade finish and sealed against UV — colors stay punchy for decades, not months.',
  },
  {
    num: '04',
    title: 'Packed',
    color: '#6EB5FF',
    desc: 'Foam-cradled in a collector-grade box and shipped within 48 hours. Unboxing is half the fun — we designed it that way.',
  },
];

export default function Craft() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const headEl     = root.querySelector<HTMLElement>('.craft-head')!;
    const headItems  = [...headEl.children] as HTMLElement[];
    const statBlocks = [...root.querySelectorAll<HTMLElement>('.craft-stat')];
    const steps      = [...root.querySelectorAll<HTMLElement>('.craft-step')];

    const ctx = gsap.context(() => {
      const headOps = headItems.map((el) => (el.style.opacity ? parseFloat(el.style.opacity) : 1));

      // Heading sweeps in from the left
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

      // Stats: odometer roll. Each digit is a masked column that rolls
      // through a full 0-9 cycle before landing on its final digit —
      // columns to the right keep rolling a beat longer, slot-machine style.
      statBlocks.forEach((block, i) => {
        const bar    = block.querySelector<HTMLElement>('.stat-bar')!;
        const strips = [...block.querySelectorAll<HTMLElement>('.stat-digit-strip')];
        const suffixInner = block.querySelector<HTMLElement>('.stat-suffix-inner')!;
        const label  = block.querySelector<HTMLElement>('.stat-label')!;

        // Hide what animates in (strips start showing "0" — intentional,
        // it reads as an odometer at rest).
        gsap.set(suffixInner, { yPercent: 120 });
        gsap.set(label, { opacity: 0 });

        const tl = gsap.timeline({
          delay: i * 0.15,
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: block, start: 'top 88%', once: true },
        });

        tl.to(bar, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);

        // Strip = 0-9 twice (20 cells). Landing on cell 10+digit guarantees
        // at least one full revolution, even for a final digit of 0.
        let lastEnd = 0;
        strips.forEach((strip, c) => {
          const digit = Number(strip.dataset.digit);
          const duration = 1.0 + c * 0.18;
          tl.to(
            strip,
            { yPercent: -(10 + digit) * 5, duration, ease: 'power4.out' },
            0.15,
          );
          lastEnd = Math.max(lastEnd, 0.15 + duration);
        });

        // Suffix rises through its mask as the last column settles
        tl.to(
          suffixInner,
          { yPercent: 0, duration: 0.55, ease: 'back.out(1.6)' },
          Math.max(0.15, lastEnd - 0.45),
        ).fromTo(
          label,
          { opacity: 0, letterSpacing: '0.45em' },
          { opacity: 0.55, letterSpacing: '0.18em', duration: 0.7, ease: 'power2.out' },
          '<',
        );
      });

      // Steps: hairline draws across → a paint swipe in the step color
      // sweeps over the row → number tumbles in from the left → title
      // wipes open (clip-path) → description floats up.
      steps.forEach((stepEl) => {
        const lineEl  = stepEl.querySelector<HTMLElement>('.step-line')!;
        const swipeEl = stepEl.querySelector<HTMLElement>('.step-swipe')!;
        const numEl   = stepEl.querySelector<HTMLElement>('.step-num')!;
        const titleEl = stepEl.querySelector<HTMLElement>('.step-title')!;
        const descEl  = stepEl.querySelector<HTMLElement>('.step-desc')!;

        gsap.set([numEl, descEl], { opacity: 0 });
        gsap.set(titleEl, { clipPath: 'inset(0 100% 0 0)' });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: stepEl, start: 'top 88%', once: true },
        });
        tl.to(lineEl, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0)
          .to(swipeEl, { scaleX: 1, duration: 0.45, ease: 'power2.in' }, 0.05)
          .set(swipeEl, { transformOrigin: 'right' }, 0.5)
          .to(swipeEl, { scaleX: 0, duration: 0.5, ease: 'power2.out' }, 0.5)
          .fromTo(
            numEl,
            { x: -70, rotation: -10, opacity: 0 },
            { x: 0, rotation: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.6)', clearProps: 'transform' },
            0.35,
          )
          .to(titleEl, { clipPath: 'inset(0 -5% 0 0)', duration: 0.55 }, 0.45)
          .fromTo(
            descEl,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 0.7, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
            0.55,
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="craft"
      ref={rootRef}
      className="relative overflow-hidden bg-white text-black"
      style={{ '--btn-hover': 'rgba(0, 0, 0, 0.08)' } as React.CSSProperties}
    >
      <div className="px-4 sm:px-24 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="craft-head">
            <p className="eyebrow anim-start" style={{ opacity: 0.55 }}>The Craft</p>
            <h2 className="anton mt-3 anim-start" style={{ fontSize: 'clamp(44px, 7vw, 110px)' }}>
              Sculpted.<br />Printed.<br />Painted.
            </h2>
            <p className="text-sm mt-6 max-w-md anim-start" style={{ opacity: 0.7, lineHeight: 1.7 }}>
              Every ToonPop figurine starts as a digital sculpt, gets resin-printed at 50-micron
              detail, then hand-painted with a matte, museum-grade finish. Graffiti tags, fabric
              folds, chain links — nothing is a sticker, everything is sculpted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 lg:gap-10 lg:pt-10">
            {STATS.map((stat) => {
              const formatted = stat.decimals
                ? stat.value.toFixed(stat.decimals)
                : stat.value.toLocaleString('en-US');
              return (
                <div
                  key={stat.label}
                  className="craft-stat group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: `${stat.color}14`,
                    border: `1px solid ${stat.color}33`,
                  }}
                >
                  {/* accent line draws itself across the top edge */}
                  <span
                    className="stat-bar absolute top-0 left-0 block"
                    style={{
                      width: '100%',
                      height: 5,
                      backgroundColor: stat.color,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                  {/* oversized ghost symbol bleeding off the corner */}
                  <span
                    aria-hidden
                    className="anton absolute pointer-events-none select-none transition-transform duration-500 group-hover:scale-110"
                    style={{
                      right: '-1%',
                      bottom: '-22%',
                      fontSize: 'clamp(120px, 12vw, 190px)',
                      color: stat.color,
                      opacity: 0.1,
                      lineHeight: 1,
                      transformOrigin: 'bottom right',
                    }}
                  >
                    {stat.suffix}
                  </span>
                  <p
                    className="anton flex items-baseline relative"
                    style={{ fontSize: 'clamp(44px, 5vw, 72px)', color: stat.color }}
                  >
                    <span className="flex">
                      {formatted.split('').map((char, ci) =>
                        /\d/.test(char) ? (
                          /* Masked odometer column — strip rolls vertically */
                          <span
                            key={ci}
                            className="inline-block overflow-hidden"
                            style={{ height: '1em', lineHeight: 1 }}
                          >
                            <span className="stat-digit-strip block" data-digit={char}>
                              {'01234567890123456789'.split('').map((d, di) => (
                                <span key={di} className="block" style={{ height: '1em', lineHeight: 1 }}>
                                  {d}
                                </span>
                              ))}
                            </span>
                          </span>
                        ) : (
                          <span key={ci} style={{ lineHeight: 1 }}>{char}</span>
                        ),
                      )}
                    </span>
                    <span
                      className="inline-block overflow-hidden ml-1"
                      style={{ fontSize: '0.55em', lineHeight: 1 }}
                    >
                      <span className="stat-suffix-inner block">{stat.suffix}</span>
                    </span>
                  </p>
                  <p className="stat-label eyebrow mt-2 relative" style={{ opacity: 0.55 }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process steps */}
        <div className="mt-20 sm:mt-28">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="craft-step group relative grid grid-cols-[72px_1fr] sm:grid-cols-[130px_280px_1fr] gap-x-4 sm:gap-x-8 gap-y-2 items-baseline py-8 sm:py-10"
            >
              {/* Hairline that draws itself */}
              <span
                className="step-line absolute top-0 left-0 w-full"
                style={{
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
              />
              {/* Paint swipe that passes across the row */}
              <span
                className="step-swipe absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: step.color,
                  opacity: 0.13,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
              />
              <span
                className="step-num anton transition-transform duration-300 group-hover:translate-x-2"
                style={{ fontSize: 'clamp(40px, 4.5vw, 72px)', color: step.color }}
              >
                {step.num}
              </span>
              <h3 className="step-title anton" style={{ fontSize: 'clamp(26px, 3vw, 44px)' }}>
                {step.title}
              </h3>
              <p className="step-desc col-start-2 sm:col-start-3 text-sm max-w-lg" style={{ lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
