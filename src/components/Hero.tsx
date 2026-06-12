import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CHARACTERS, DURATION, EASE } from '../data';
import { gsap, scrollToId } from '../lib/gsap';
import Grain from './Grain';

type Role = 'center' | 'left' | 'right' | 'back';

export default function Hero() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const ghostWrapRef = useRef<HTMLDivElement>(null);  // receives parallax yPercent
  const ghostRef   = useRef<HTMLSpanElement>(null);   // receives entrance opacity only
  const carouselRef = useRef<HTMLDivElement>(null);
  const copyRef    = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLAnchorElement>(null);
  const nameRef    = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const mountedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  );

  // Preload all 4 images
  useEffect(() => {
    CHARACTERS.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Entrance + scroll parallax — all ref-based, no class selectors
  useEffect(() => {
    const ghost     = ghostRef.current;
    const ghostWrap = ghostWrapRef.current;
    const carousel  = carouselRef.current;
    const copy      = copyRef.current;
    const discover  = discoverRef.current;
    if (!ghost || !ghostWrap || !carousel || !copy || !discover) return;

    const ctx = gsap.context(() => {
      // Entrance: opacity-only on ghost text so the parallax (yPercent on
      // the wrapper) never conflicts with a scale transform on the span.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(ghost, { opacity: 1, duration: 0.9 })
        .to(carousel, { opacity: 1, y: 0, duration: 0.9, clearProps: 'transform' }, '-=0.55')
        .to(
          [...copy.children],
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, clearProps: 'transform' },
          '-=0.45',
        )
        .to(discover, { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform' }, '<');

      // Scroll parallax on the wrapper only — completely separate element
      // from the entrance animation, so transforms never interfere.
      gsap.to(ghostWrap, {
        yPercent: 24,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Cross-fade character name / tagline + ghost text when index changes
  useEffect(() => {
    const el    = nameRef.current;
    const ghost = ghostRef.current;
    if (!el) return;

    // Skip the crossfade on the very first mount — the entrance animation
    // owns the ghost opacity then and we must not conflict with it.
    if (!mountedRef.current) { mountedRef.current = true; return; }

    const tl = gsap.timeline();
    tl.to(el, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in' })
      .set(el, { y: 8 })
      .to(el, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', clearProps: 'transform' });

    if (ghost) {
      gsap.to(ghost, { opacity: 0, duration: 0.15, ease: 'power2.in',
        onComplete: () => gsap.to(ghost, { opacity: 1, duration: 0.4, ease: 'power2.out' }),
      });
    }
    return () => { tl.kill(); };
  }, [activeIndex]);

  const select = useCallback((index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), DURATION);
  }, [isAnimating, activeIndex]);

  const navigate = useCallback(
    (dir: 'next' | 'prev') =>
      select(dir === 'next' ? (activeIndex + 1) % 4 : (activeIndex + 3) % 4),
    [select, activeIndex],
  );

  // Auto-rotate — restarts on every index change so any manual interaction
  // postpones the next advance by a full 4 s.
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % 4;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), DURATION);
        return next;
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, [activeIndex]);

  const roleOf = (index: number): Role => {
    if (index === activeIndex)          return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const roleStyle = (role: Role): CSSProperties => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : '0%',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  const character = CHARACTERS[activeIndex];

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: character.bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        <Grain />

        {/* Giant ghost text
            ghostWrapRef → receives scroll parallax (yPercent)
            ghostRef     → receives entrance opacity fade only
            These are separate elements so the two GSAP tweens never conflict. */}
        <div
          ref={ghostWrapRef}
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            ref={ghostRef}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 0,          // initial — GSAP fades this to 1
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {character.name}
          </span>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="absolute inset-0"
          style={{ zIndex: 3, opacity: 0, transform: 'translateY(120px)' }}
        >
          {CHARACTERS.map((ch, index) => {
            const role = roleOf(index);
            return (
              <div
                key={ch.src}
                onClick={() => select(index)}
                role={role !== 'center' ? 'button' : undefined}
                aria-label={role !== 'center' ? `Show ${ch.name}` : undefined}
                tabIndex={role !== 'center' ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') select(index);
                }}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  // height + bottom added so size and vertical position
                  // cross-fade smoothly alongside left / transform / filter.
                  transition: [
                    `transform ${DURATION}ms ${EASE}`,
                    `filter ${DURATION}ms ${EASE}`,
                    `opacity ${DURATION}ms ${EASE}`,
                    `left ${DURATION}ms ${EASE}`,
                    `height ${DURATION}ms ${EASE}`,
                    `bottom ${DURATION}ms ${EASE}`,
                  ].join(', '),
                  willChange: 'transform, filter, opacity, left, height, bottom',
                  // The center box is transparent — pointer-events:none lets
                  // clicks pass through to the blurred character behind it.
                  pointerEvents: role === 'center' ? 'none' : 'auto',
                  cursor: role !== 'center' ? 'pointer' : 'default',
                  ...roleStyle(role),
                }}
              >
                <img
                  src={ch.src}
                  alt={ch.name}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left: copy block + animated character name + nav buttons */}
        <div
          ref={copyRef}
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 340 }}
        >
          {/* Character name + tagline — cross-fades on index change */}
          <div
            ref={nameRef}
            style={{ opacity: 0, transform: 'translateY(30px)', marginBottom: 12 }}
          >
            <p
              className="font-bold text-white"
              style={{ fontSize: 'clamp(22px, 2.8vw, 36px)', lineHeight: 1.15 }}
            >
              {character.name}
            </p>
            <p className="text-xs sm:text-sm mt-1" style={{ color: '#ffffff', opacity: 0.8 }}>
              {character.tagline} — <span className="font-semibold">${character.price}</span>
            </p>
          </div>

          {/* Description — hidden on mobile */}
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{
              color: '#ffffff',
              opacity: 0,
              transform: 'translateY(30px)',
              lineHeight: 1.6,
            }}
          >
            Hand-painted resin, shipped in collector-grade packaging.
          </p>

          {/* Nav buttons */}
          <div
            className="flex gap-3 text-white"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            <button
              type="button"
              aria-label="Previous figurine"
              onClick={() => navigate('prev')}
              className="btn-circle w-12 h-12 sm:w-16 sm:h-16"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Next figurine"
              onClick={() => navigate('next')}
              className="btn-circle w-12 h-12 sm:w-16 sm:h-16"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right: discover link */}
        <a
          ref={discoverRef}
          href="#collection"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('#collection');
          }}
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center hover:opacity-100 transition-opacity duration-200"
          style={{
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
            textDecoration: 'none',
            opacity: 0,
            transform: 'translateY(30px)',
          }}
        >
          DISCOVER IT
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
