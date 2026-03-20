import React from 'react';
import { motion } from 'framer-motion';
import './ScrollVelocity.css';

const ScrollVelocity = ({ text, velocity = 5 }) => {
  return (
    <div className="scroll-velocity-wrapper">
      <motion.div 
        className="scroll-velocity-content"
        animate={{ x: [0, -1000] }}
        transition={{ ease: "linear", duration: velocity, repeat: Infinity }}
      >
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
};

export default ScrollVelocity;
