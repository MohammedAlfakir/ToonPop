export const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const DURATION = 650;

export const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")";

export interface Character {
  src: string;
  bg: string;
  panel: string;
  name: string;
  price: number;
  tagline: string;
}

export const CHARACTERS: Character[] = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    name: 'Blaze',
    price: 49,
    tagline: 'Street-heat energy, zero chill',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    name: 'Moss',
    price: 45,
    tagline: 'Cool, collected, always rooted',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    name: 'Candy',
    price: 52,
    tagline: 'Sweet looks, fearless moves',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    name: 'Focus',
    price: 49,
    tagline: 'No limits, ever — locked in',
  },
];

export const REVIEWS = [
  {
    quote:
      'The paint detail is unreal — even better than the renders. Focus sits on my desk and gets compliments every single day.',
    name: 'Mara J.',
    role: 'Collector since 2024',
  },
  {
    quote:
      'Shipped in 48 hours, packed like treasure. The blue colorway is even punchier in person than in the photos.',
    name: 'Dev P.',
    role: 'First-time buyer',
  },
  {
    quote:
      'Bought the whole crew of four. The matte finish and the little graffiti tags make these feel truly one-of-a-kind.',
    name: 'Lena K.',
    role: 'Owns the full lineup',
  },
];

export const STATS = [
  { value: 12500, suffix: '+', label: 'Figurines shipped', decimals: 0, color: '#F4845F' },
  { value: 4.9, suffix: '★', label: 'Average rating', decimals: 1, color: '#E882B4' },
  { value: 48, suffix: 'h', label: 'From order to door', decimals: 0, color: '#6EB5FF' },
];
