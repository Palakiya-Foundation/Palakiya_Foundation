import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Animated number counter that runs once when scrolled into view
const CountUp = ({ value, duration = 1800, suffix = '+' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const target = Number(value) || 0;

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const format = (n) => {
    if (target >= 1000) return n.toLocaleString();
    return n;
  };

  return (
    <span ref={ref}>
      {format(display)}
      {suffix}
    </span>
  );
};

export default CountUp;
