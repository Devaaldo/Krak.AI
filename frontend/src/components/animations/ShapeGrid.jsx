import React, { useState, useEffect, useRef } from 'react';

const ShapeGrid = ({
  speed = 0.1,
  squareSize = 100,
  direction = 'diagonal',
  borderColor = '#999',
  hoverFillColor = '#222',
  shape = 'square',
  hoverTrailAmount = 5
}) => {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setGridSize({
          cols: Math.ceil(width / squareSize) + 1,
          rows: Math.ceil(height / squareSize) + 1
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [squareSize]);

  // Use a global window listener so the grid detects movement even if masked by other DOM elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const col = Math.floor(x / squareSize);
      const row = Math.floor(y / squareSize);
      const id = `${col}-${row}`;

      setTrail(prev => {
        if (prev[prev.length - 1] === id) return prev;
        const newTrail = [...prev, id].slice(-hoverTrailAmount);
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [squareSize, hoverTrailAmount]);

  const squares = [];
  for (let r = 0; r < gridSize.rows; r++) {
    for (let c = 0; c < gridSize.cols; c++) {
      const id = `${c}-${r}`;
      
      let opacity = 0;
      const trailIndex = trail.indexOf(id);
      if (trailIndex !== -1) {
        opacity = (trailIndex + 1) / trail.length;
      }
      
      squares.push(
        <div
          key={id}
          style={{
            width: squareSize,
            height: squareSize,
            borderBottom: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            borderTop: r === 0 ? `1px solid ${borderColor}` : 'none',
            borderLeft: c === 0 ? `1px solid ${borderColor}` : 'none',
            position: 'relative',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: hoverFillColor,
              opacity: opacity,
              transition: `opacity ${speed}s ease-out`,
              borderRadius: shape === 'circle' ? '50%' : '0'
            }}
          />
        </div>
      );
    }
  }

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexWrap: 'wrap',
        overflow: 'hidden',
        pointerEvents: 'none',
        alignContent: 'flex-start'
      }}
    >
      {squares}
    </div>
  );
};

export default ShapeGrid;
