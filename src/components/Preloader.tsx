import { useEffect, useRef } from 'react';
import { CHARACTERS } from '../data';
import { gsap, ScrollTrigger } from '../lib/gsap';
import Grain from './Grain';

const BRAND_COLORS = ['#F4845F', '#6BBF7A', '#E882B4', '#6EB5FF'];
const WORD = 'TOONPOP'.split('');
// The trailing "POP" gets the brand colors — the leading "TOON" stays white.
const LETTER_COLORS: Record<number, string> = { 4: '#F4845F', 5: '#E882B4', 6: '#6EB5FF' };

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

interface PreloaderProps {
  /** Fired as the curtain starts lifting — mount the site beneath it now. */
  onReveal: () => void;
  /** Fired once the curtain is fully off-screen — safe to unmount the preloader. */
  onDone: () => void;
}

export default function Preloader({ onReveal, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Latest callbacks without re-running the effect.
  const onRevealRef = useRef(onReveal);
  const onDoneRef = useRef(onDone);
  onRevealRef.current = onReveal;
  onDoneRef.current = onDone;

  useEffect(() => {
    const root = rootRef.current;
    const base = baseRef.current;
    if (!root || !base) return;

    const letters = lettersRef.current
      ? Array.from(lettersRef.current.querySelectorAll<HTMLElement>('[data-letter]'))
      : [];
    const dots = dotsRef.current ? Array.from(dotsRef.current.children) : [];
    const strips = Array.from(root.querySelectorAll<HTMLElement>('[data-strip]'));

    document.body.style.overflow = 'hidden';

    let cancelled = false;
    const counter = { v: 0 };
    const render = () => {
      if (percentRef.current) {
        percentRef.current.textContent = String(Math.round(counter.v)).padStart(2, '0');
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${counter.v / 100})`;
      }
    };

    const ctx = gsap.context(() => {
      // Entrance — masked letter rise with a bouncy overshoot, then chrome fades in.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        // fromTo — the inline translateY(110%) computes to a pixel matrix, so
        // GSAP must own both y and yPercent or the tween is a no-op.
        .fromTo(
          letters,
          { y: 0, yPercent: 110 },
          { yPercent: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.055 },
          0.15,
        )
        .to(eyebrowRef.current, { opacity: 0.6, y: 0, duration: 0.5 }, '-=0.5')
        .to(dotsRef.current, { opacity: 1, duration: 0.5 }, '<')
        .to(footerRef.current, { opacity: 1, duration: 0.6 }, '<');

      // Loading-dot wave in the four brand colors.
      gsap.to(dots, {
        y: -10,
        duration: 0.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });

      // Ambient counter climb — parks at 92 until the assets are truly in;
      // the exit timeline owns the final push to 100.
      gsap.to(counter, { v: 92, duration: 2.1, delay: 0.4, ease: 'power1.inOut', onUpdate: render });
    }, root);

    const minTime = new Promise<void>((resolve) => setTimeout(resolve, 2400));
    const fontsReady: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([...CHARACTERS.map((c) => loadImage(c.src)), fontsReady, minTime]).then(() => {
      if (cancelled) return;
      ctx.add(() => {
        gsap
          .timeline()
          .to(counter, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render })
          .to(letters, { yPercent: -110, duration: 0.45, ease: 'power2.in', stagger: 0.04 }, '+=0.15')
          .to([eyebrowRef.current, dotsRef.current, footerRef.current], {
            opacity: 0,
            y: -16,
            duration: 0.4,
            ease: 'power2.in',
          }, '<')
          .add(() => {
            root.style.pointerEvents = 'none';
            onRevealRef.current();
          })
          // Curtain lift: the dark panel leads, the four brand colors trail it.
          .to([base, ...strips], {
            yPercent: -100,
            duration: 1.0,
            ease: 'power4.inOut',
            stagger: 0.085,
          }, '+=0.05')
          .add(() => onDoneRef.current());
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      document.body.style.overflow = '';
      // Sections mounted while scrolling was locked — re-measure their triggers.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0" style={{ zIndex: 200 }}>
      {/* Brand-color strips stacked under the dark panel — they chase it off-screen on exit. */}
      {BRAND_COLORS.map((color, i) => (
        <div
          key={color}
          data-strip
          className="absolute inset-0"
          style={{ backgroundColor: color, zIndex: 40 - i * 10 }}
        />
      ))}

      <div
        ref={baseRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 50, backgroundColor: '#111111' }}
      >
        <Grain />

        <div className="relative flex flex-col items-center px-4" style={{ zIndex: 60 }}>
          <p
            ref={eyebrowRef}
            className="eyebrow text-white"
            style={{ opacity: 0, transform: 'translateY(12px)', marginBottom: 18 }}
          >
            Collector-grade vinyl
          </p>

          <div ref={lettersRef} className="flex" style={{ overflow: 'hidden' }}>
            {WORD.map((ch, i) => (
              <span
                key={i}
                data-letter
                className="anton"
                style={{
                  display: 'inline-block',
                  color: LETTER_COLORS[i] ?? '#ffffff',
                  fontSize: 'clamp(56px, 13vw, 170px)',
                  transform: 'translateY(110%)',
                }}
              >
                {ch}
              </span>
            ))}
          </div>

          <div ref={dotsRef} className="flex" style={{ gap: 10, marginTop: 30, opacity: 0 }}>
            {BRAND_COLORS.map((color) => (
              <span
                key={color}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: color,
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        </div>

        <div ref={footerRef} className="absolute inset-x-0 bottom-0" style={{ zIndex: 60, opacity: 0 }}>
          <div className="flex items-end justify-between px-4 sm:px-10 pb-4 sm:pb-5">
            <span className="anton text-white" style={{ fontSize: 'clamp(44px, 8vw, 96px)', opacity: 0.92 }}>
              <span ref={percentRef}>00</span>
              <span style={{ fontSize: '0.4em' }}>%</span>
            </span>
            <span className="eyebrow text-white" style={{ opacity: 0.6, paddingBottom: 10 }}>
              Loading the crew
            </span>
          </div>
          <div style={{ height: 3, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}>
            <div
              ref={barRef}
              style={{
                height: '100%',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, #F4845F, #6BBF7A, #E882B4, #6EB5FF)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
