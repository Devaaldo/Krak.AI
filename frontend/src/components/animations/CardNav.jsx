import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CardNav = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <motion.div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            animate={{
              scale: isActive ? 1.05 : 1,
              opacity: isActive ? 1 : 0.6,
              boxShadow: isActive ? '0 10px 20px rgba(37,99,235,0.2)' : 'none',
              filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
            }}
            whileHover={{ scale: 1.02, opacity: 1, filter: 'grayscale(0%)' }}
            style={{
              padding: '1.5rem', background: 'var(--bg-alt)', border: '1px solid var(--border-color)',
              borderRadius: '1rem', cursor: 'pointer', maxWidth: '300px', flex: 1, minWidth: '250px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: isActive ? 'var(--primary-color)' : 'inherit' }}>{item.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardNav;
