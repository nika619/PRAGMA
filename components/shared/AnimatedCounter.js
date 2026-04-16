'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 2 }) {
  const [hasStarted, setHasStarted] = useState(false);
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    setHasStarted(true);
    spring.set(value);
  }, [value, spring]);

  if (!hasStarted) {
    return <span>0</span>;
  }

  return <motion.span>{display}</motion.span>;
}
