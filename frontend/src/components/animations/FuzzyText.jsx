import React from 'react';

const FuzzyText = ({ text }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="fuzzy">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <h1
        style={{
          filter: 'url(#fuzzy)',
          fontSize: '6rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          transition: 'filter 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.filter = 'none'}
        onMouseLeave={(e) => e.currentTarget.style.filter = 'url(#fuzzy)'}
      >
        {text}
      </h1>
    </div>
  );
};

export default FuzzyText;
