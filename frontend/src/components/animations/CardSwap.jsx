import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CardSwap = ({ frontContent, backContent }) => {
  const [isFlipped, setFlipped] = useState(false);

  return (
    <div 
      style={{ perspective: '1000px', width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={() => setFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
          {frontContent}
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

export default CardSwap;
