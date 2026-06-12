import { useEffect, useRef, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { gsap, scrollToId, scrollToTop } from '../lib/gsap';

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Craft', href: '#craft' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Join', href: '#join' },
];

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.2,
        clearProps: 'all',
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (cartCount > 0 && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4 },
        { scale: 1, duration: 0.4, ease: 'back.out(3)' },
      );
    }
  }, [cartCount]);

  return (
    <header
      ref={rootRef}
      className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-4 sm:px-8 py-4 text-white transition-colors duration-300 ${
        scrolled ? 'bg-black/40 backdrop-blur-md' : ''
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="anton cursor-pointer"
        style={{ opacity: 0.9, fontSize: 'clamp(18px, 2vw, 26px)' }}
      >
        ToonPop
      </button>

      <nav className="hidden md:flex items-center gap-8">
        {LINKS.map((link) => (
          <button
            key={link.href}
            type="button"
            onClick={() => scrollToId(link.href)}
            className="text-xs font-medium uppercase cursor-pointer opacity-80 hover:opacity-100"
            style={{ letterSpacing: '0.14em', transition: 'opacity 150ms' }}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={onCartClick}
        aria-label="Open cart"
        className="btn-circle relative w-10 h-10 sm:w-11 sm:h-11"
      >
        <ShoppingBag size={16} strokeWidth={2.25} />
        {cartCount > 0 && (
          <span
            ref={badgeRef}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center"
          >
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
