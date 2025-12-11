import React from 'react';
import { motion } from 'framer-motion';

interface WeatherEffectProps {
  condition: 'Rain' | 'Snow' | null;
}

const Raindrop: React.FC = () => {
  const x = Math.random() * 100;
  const duration = Math.random() * 0.5 + 0.5;
  const delay = Math.random() * 2;

  return (
    <motion.div
      className="absolute w-0.5 h-10 bg-gradient-to-b from-cyan-400/0 to-cyan-400/80"
      style={{ left: `${x}vw`, top: '-40px' }}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: '100vh', opacity: 0 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
};

const Snowflake: React.FC = () => {
    const x = Math.random() * 100;
    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * 5;
    const size = Math.random() * 8 + 4;

    return (
        <motion.div
            className="absolute text-white"
            style={{ 
                left: `${x}vw`, 
                top: `-${size}px`,
                fontSize: `${size}px`,
                lineHeight: 1
            }}
            initial={{ y: 0, x: 0, opacity: 1 }}
            animate={{ y: '100vh', x: [0, -20, 20, 0], opacity: 0 }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
        >
            ❄
        </motion.div>
    );
};

export const WeatherEffect: React.FC<WeatherEffectProps> = ({ condition }) => {
  if (!condition) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {condition === 'Rain' && Array.from({ length: 100 }).map((_, i) => <Raindrop key={i} />)}
      {condition === 'Snow' && Array.from({ length: 50 }).map((_, i) => <Snowflake key={i} />)}
    </div>
  );
};
