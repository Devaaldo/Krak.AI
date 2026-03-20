import React from 'react';
import { Video, Camera } from 'lucide-react';

const Live = () => {
  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Live Detection</h1>
        <p className="dashboard-desc">Stream video feeds for real-time detection of structural anomalies.</p>
      </div>

      <div className="video-player-placeholder" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Camera size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>Awaiting Camera Connection...</p>
        <button className="button-primary" style={{ marginTop: '1.5rem' }}>
          Connect Camera
        </button>
      </div>
      
      <div className="feature-grid" style={{ marginTop: '3rem' }}>
        <div className="feature-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
            Disconnected
          </div>
        </div>
        <div className="feature-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Detection Rate</h3>
          <p style={{ color: 'var(--text-muted)' }}>0 FPS</p>
        </div>
      </div>
    </div>
  );
};

export default Live;
