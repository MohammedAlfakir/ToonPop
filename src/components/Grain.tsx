import { GRAIN_URI } from '../data';

export default function Grain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 50,
        opacity: 0.4,
        backgroundImage: GRAIN_URI,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
