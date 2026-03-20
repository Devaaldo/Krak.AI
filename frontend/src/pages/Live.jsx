import React from 'react';
import ModelViewer from '../components/animations/ModelViewer';
import { Video, Camera } from 'lucide-react';

const Live = () => {
  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Live Detection</h1>
        <p className="dashboard-desc">Stream video feeds for real-time detection of structural anomalies.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="video-player-placeholder">
          <div className="status-badge" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
            <span className="status-dot"></span> Waiting for camera signal...
          </div>
        </div>
        
        <div style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Live 3D Topological Map</h3>
          <ModelViewer />
        </div>
      </div>
      <button className="button-primary" style={{ marginTop: '1.5rem' }}>
        Connect Camera
      </button>
      
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
