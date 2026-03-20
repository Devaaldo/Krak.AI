import React from 'react';
import { motion } from 'framer-motion';

const FadeInSection = ({ children, delay = 0, yOffset = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
