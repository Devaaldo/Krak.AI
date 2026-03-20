import React from 'react';
import FuzzyText from '../components/animations/FuzzyText';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
      <FuzzyText text="404" />
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '-2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The structural layer you are looking for has eroded.</p>
      <Link to="/" className="btn-primary">Return to Home</Link>
    </div>
  );
};

export default NotFound;
