import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

export const scrollToId = (id: string) =>
  gsap.to(window, { duration: 1, ease: 'power3.inOut', scrollTo: { y: id, offsetY: 0 } });

export const scrollToTop = () =>
  gsap.to(window, { duration: 1, ease: 'power3.inOut', scrollTo: 0 });
