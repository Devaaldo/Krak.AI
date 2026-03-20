import React from 'react';
import BorderGlow from '../components/animations/BorderGlow';
import { Github, ExternalLink } from 'lucide-react';
import GradientText from '../components/animations/GradientText';
import VariableProximity from '../components/animations/VariableProximity';

const Projects = () => {
  return (
    <div className="page-container">
      <div className="dashboard-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <h1 className="dashboard-title" style={{ fontSize: '3rem' }}>
          <VariableProximity text="Open Source Integrations" />
        </h1>
        <p className="dashboard-desc" style={{ fontSize: '1.25rem' }}>We build tools to analyze structural data. Check out our open-source projects.</p>
      </div>

      <div className="feature-grid">
        <BorderGlow>
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'inherit', height: '100%' }}>
            <Github size={32} style={{ marginBottom: '1rem', color: 'var(--primary-color)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Krak.AI Core</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>The deep learning backend built on MobileNetV2 and Wavelet Transforms.</p>
            <a href="https://github.com/Devaaldo/Crack-Detection" target="_blank" rel="noreferrer" className="btn-outline" style={{ border: 'none', background: '#f1f5f9' }}>
               View Repository <ExternalLink size={14} style={{ marginLeft: '0.25rem' }} />
            </a>
          </div>
        </BorderGlow>
        
        <BorderGlow>
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'inherit', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Github size={20} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Crack-Detection-MLTools</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              A collection of utility scripts for pre-processing images, generating synthetic crack data, and evaluating IoU scores for custom-trained MobileNet variations.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', background: '#e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600 }}>Jupyter</span>
              <span style={{ fontSize: '0.75rem', background: '#e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600 }}>Python</span>
              <span style={{ fontSize: '0.75rem', background: '#e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600 }}>Keras</span>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
};

export default Projects;
