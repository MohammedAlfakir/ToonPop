import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CHARACTERS } from '../data';
import { gsap, scrollToId } from '../lib/gsap';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  counts: Record<number, number>;
  setCounts: Dispatch<SetStateAction<Record<number, number>>>;
  showToast: (msg: string) => void;
}

export default function CartDrawer({ open, onClose, counts, setCounts, showToast }: CartDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;
    if (open) {
      gsap.set([panel, overlay], { pointerEvents: 'auto' });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(panel, { x: 0, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' });
      gsap.to(panel, {
        x: '100%',
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => gsap.set([panel, overlay], { pointerEvents: 'none' }),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const setQty = (index: number, qty: number) => {
    setCounts((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[index];
      else next[index] = qty;
      return next;
    });
  };

  const entries = Object.entries(counts)
    .map(([key, qty]) => ({ index: Number(key), qty }))
    .filter((e) => e.qty > 0);
  const subtotal = entries.reduce((sum, e) => sum + CHARACTERS[e.index].price * e.qty, 0);

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[150]"
        style={{ opacity: 0, pointerEvents: 'none' }}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[200] flex flex-col text-white"
        style={{ backgroundColor: '#111111', transform: 'translateX(100%)', pointerEvents: 'none' }}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="anton" style={{ fontSize: 28 }}>
            Your Cart
          </h3>
          <button type="button" aria-label="Close cart" onClick={onClose} className="btn-circle w-10 h-10">
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
            <p className="anton" style={{ fontSize: 24, opacity: 0.6 }}>
              Your cart is empty
            </p>
            <button
              type="button"
              className="btn-pill px-6 py-3"
              onClick={() => {
                onClose();
                scrollToId('#collection');
              }}
            >
              Browse the lineup
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4">
              {entries.map(({ index, qty }) => {
                const character = CHARACTERS[index];
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl shrink-0 flex items-end justify-center overflow-hidden"
                      style={{ backgroundColor: character.panel }}
                    >
                      <img
                        src={character.src}
                        alt={character.name}
                        draggable={false}
                        className="h-14"
                        style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="anton" style={{ fontSize: 18 }}>
                        {character.name}
                      </p>
                      <p className="text-xs" style={{ opacity: 0.6 }}>
                        ${character.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Remove one ${character.name}`}
                        onClick={() => setQty(index, qty - 1)}
                        className="btn-circle w-8 h-8"
                      >
                        <Minus size={12} strokeWidth={2.5} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <button
                        type="button"
                        aria-label={`Add one ${character.name}`}
                        onClick={() => setQty(index, qty + 1)}
                        className="btn-circle w-8 h-8"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="eyebrow" style={{ opacity: 0.7 }}>
                  Subtotal
                </p>
                <p className="anton" style={{ fontSize: 26 }}>
                  ${subtotal}
                </p>
              </div>
              <button
                type="button"
                className="btn-pill w-full px-6 py-4"
                onClick={() => showToast('Demo checkout — nothing was charged')}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
