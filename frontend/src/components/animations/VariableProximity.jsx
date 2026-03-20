import React from 'react';
import { motion } from 'framer-motion';

const VariableProximity = ({ text }) => {
  const characters = text.split('');

  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          whileHover={{ scale: 1.5, fontWeight: 900, color: 'var(--primary-color)' }}
          style={{
            display: 'inline-block',
            cursor: 'default',
            transition: 'font-weight 0.2s ease, color 0.2s ease',
            transformOrigin: 'bottom center'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

export default VariableProximity;
