import { useEffect, useRef } from 'react';
import { ArrowUp, Instagram, Twitter, Youtube } from 'lucide-react';
import { gsap, scrollToId, scrollToTop } from '../lib/gsap';

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Craft', href: '#craft' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Join', href: '#join' },
];

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Twitter', Icon: Twitter },
  { label: 'YouTube', Icon: Youtube },
];

interface FooterProps {
  showToast: (msg: string) => void;
}

export default function Footer({ showToast }: FooterProps) {
  const rootRef   = useRef<HTMLElement>(null);
  const giantRef  = useRef<HTMLParagraphElement>(null);
  const linksRef  = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root    = rootRef.current;
    const giant   = giantRef.current;
    const links   = linksRef.current;
    const socials = socialsRef.current;
    const bottom  = bottomRef.current;
    if (!root || !giant || !links || !socials || !bottom) return;

    const ctx = gsap.context(() => {
      // Giant wordmark scales + fades in
      gsap.fromTo(
        giant,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 0.95,
          duration: 1.0,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start: 'top 82%', once: true },
        },
      );

      // Nav links stagger in
      gsap.fromTo(
        [...links.children],
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: links, start: 'top 90%', once: true },
        },
      );

      // Social buttons pop in with back ease
      gsap.fromTo(
        [...socials.children],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(2)',
          clearProps: 'transform',
          scrollTrigger: { trigger: socials, start: 'top 90%', once: true },
        },
      );

      // Bottom row fades in last
      gsap.fromTo(
        bottom,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: bottom, start: 'top 95%', once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      <div className="px-4 sm:px-24 pt-20 sm:pt-28 pb-8">
        <p
          ref={giantRef}
          className="anton text-center select-none"
          style={{ fontSize: 'clamp(70px, 19vw, 300px)', opacity: 0 }}
        >
          ToonPop
        </p>

        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <nav ref={linksRef} className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollToId(link.href)}
                className="text-xs font-medium uppercase cursor-pointer opacity-70 hover:opacity-100"
                style={{ letterSpacing: '0.14em', transition: 'opacity 150ms' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div ref={socialsRef} className="flex items-center gap-3">
            {SOCIALS.map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => showToast('Socials coming soon — stay casted')}
                className="btn-circle w-11 h-11"
              >
                <Icon size={16} strokeWidth={2.25} />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={bottomRef}
          className="mt-12 pt-6 flex items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)', opacity: 0 }}
        >
          <p className="text-[11px] uppercase" style={{ letterSpacing: '0.14em', opacity: 0.5 }}>
            © 2026 ToonPop — Designed by{' '}
            <a
              href="https://www.mohammedalfakir.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100"
              style={{ opacity: 0.85, textDecoration: 'underline', textUnderlineOffset: '3px', transition: 'opacity 150ms' }}
            >
              Mohammed Alfakir
            </a>
          </p>
          <button type="button" aria-label="Back to top" onClick={scrollToTop} className="btn-circle w-11 h-11">
            <ArrowUp size={16} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </footer>
  );
}
