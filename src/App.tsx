import { useState } from 'react';
import { CHARACTERS } from './data';
import Navbar from './components/Navbar';
import ProgressBar from './components/ProgressBar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Collection from './components/Collection';
import Craft from './components/Craft';
import Reviews from './components/Reviews';
import Join from './components/Join';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast, { type ToastData } from './components/Toast';

export default function App() {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (msg: string) => setToast({ id: Date.now(), msg });

  const addToCart = (index: number) => {
    setCounts((c) => ({ ...c, [index]: (c[index] ?? 0) + 1 }));
    showToast(`${CHARACTERS[index].name} added to cart`);
  };

  const cartCount = Object.values(counts).reduce((sum, qty) => sum + qty, 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <ProgressBar />
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <Collection onAdd={addToCart} />
      <Craft />
      <Reviews />
      <Join showToast={showToast} />
      <Footer showToast={showToast} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        counts={counts}
        setCounts={setCounts}
        showToast={showToast}
      />
      <Toast toast={toast} />
    </div>
  );
}
