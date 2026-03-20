import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const CountUp = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end, 10);
    if (start === endVal) return;

    let totalMilSecDur = duration * 1000;
    let incrementTime = (totalMilSecDur / endVal) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === endVal) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export default CountUp;
