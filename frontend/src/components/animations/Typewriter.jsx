import React from 'react';
import { motion } from 'framer-motion';

const Typewriter = ({ text, speed = 0.05, className = '' }) => {
  const characters = text.split('');

  return (
    <p className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: index * speed }}
        >
          {char}
        </motion.span>
      ))}
    </p>
  );
};

export default Typewriter;
