import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import Grain from './Grain';

interface JoinProps {
  showToast: (msg: string) => void;
}

export default function Join({ showToast }: JoinProps) {
  const rootRef  = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const doneRef  = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);

  useEffect(() => {
    const root  = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const items = [...inner.children] as HTMLElement[];

    const ctx = gsap.context(() => {
      const [eyebrow, title, desc, form] = items;
      const eyebrowOp = eyebrow.style.opacity ? parseFloat(eyebrow.style.opacity) : 1;
      const descOp = desc.style.opacity ? parseFloat(desc.style.opacity) : 1;

      // Apply hidden states immediately — a triggered timeline only applies
      // its from-states once the trigger fires.
      gsap.set([eyebrow, title, desc], { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      });
      // Mirror of Reviews: this section sweeps in from the LEFT
      tl.fromTo(eyebrow, { x: -60, opacity: 0 }, { x: 0, opacity: eyebrowOp, duration: 0.6, clearProps: 'transform' })
        .fromTo(title, { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, clearProps: 'transform' }, 0.08)
        .fromTo(desc, { y: 24, opacity: 0 }, { y: 0, opacity: descOp, duration: 0.6, clearProps: 'transform' }, 0.25);
      if (form) {
        tl.fromTo(
          form,
          { y: 30, scale: 0.95, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)', clearProps: 'transform' },
          0.38,
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = doneRef.current;
    if (!done || !el) return;
    gsap.fromTo(
      el,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)', clearProps: 'transform' },
    );
  }, [done]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email');
      return;
    }
    setDone(true);
  };

  return (
    <section
      id="join"
      ref={rootRef}
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#F4845F' }}
    >
      <Grain />
      <div
        ref={innerRef}
        className="relative px-4 sm:px-24 py-20 sm:py-28 flex flex-col items-center text-center"
        style={{ zIndex: 3 }}
      >
        <p className="eyebrow anim-start" style={{ opacity: 0.85 }}>Newsletter</p>
        <h2 className="anton mt-3 anim-start" style={{ fontSize: 'clamp(44px, 8vw, 120px)' }}>
          Join the Club
        </h2>
        <p className="text-sm mt-4 max-w-md anim-start" style={{ opacity: 0.85, lineHeight: 1.6 }}>
          Early access to limited drops, behind-the-scenes sculpts and member-only colorways.
          No spam, just toons.
        </p>

        {done ? (
          <p
            ref={doneRef}
            className="anton mt-10"
            style={{ fontSize: 'clamp(28px, 5vw, 64px)', opacity: 0 }}
          >
            You're in ✦ Welcome
          </p>
        ) : (
          <form onSubmit={submit} className="mt-10 flex items-center gap-3 w-full max-w-md anim-start">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@EMAIL.COM"
              aria-label="Email address"
              className="flex-1 min-w-0 rounded-full px-6 py-4 text-xs font-semibold uppercase bg-transparent text-white outline-none placeholder-white/70 focus:bg-white/10"
              style={{ border: '2px solid #ffffff', letterSpacing: '0.12em', transition: 'background-color 150ms' }}
            />
            <button type="submit" aria-label="Subscribe" className="btn-circle w-[52px] h-[52px] shrink-0">
              <ArrowRight size={22} strokeWidth={2.25} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
