import React from 'react';
import ProfileCard from '../components/animations/ProfileCard';
import GradientText from '../components/animations/GradientText';
import TrueFocus from '../components/animations/TrueFocus';

const About = () => {
  return (
    <div className="page-container">
      <div className="dashboard-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <h1 className="dashboard-title" style={{ fontSize: '3rem' }}><GradientText text="About Krak.AI" /></h1>
        <p className="dashboard-desc" style={{ fontSize: '1.25rem' }}>Understanding the technology and mission behind our crack detection system.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Added TrueFocus Here */}
        <div style={{ margin: '4rem 0', fontSize: '2rem', fontWeight: 700, textAlign: 'center', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem' }}>
          <TrueFocus text="Securing tomorrow's infrastructure by identifying invisible flaws today." />
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Krak.AI automates and enhances the historically manual process of infrastructure inspection.
            By utilizing cutting-edge Wavelet Transforms and deep learning, we ensure that structural safety checks are uncompromised and highly reliable.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>The Technology</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Our underlying engine uses a powerful combination of <strong>Wavelet Transforms</strong> and <strong>Convolutional Neural Networks (CNNs)</strong>.
          </p>
          <ul style={{ color: 'var(--text-muted)', listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Wavelet Transform:</strong> Acts as an advanced pre-processing step to highlight the high-frequency components of an image, such as the edge details of cracks, while minimizing noise.</li>
            <li><strong>MobileNetV2:</strong> We employ a lightweight, highly efficient CNN architecture that allows our detection to run in real-time on standard hardware without compromising accuracy.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>How accurate is the detection?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Our MobileNetV2 architecture achieves industry-leading IoU scores across diverse concrete and metallic surfaces, though final safety sign-offs remain with certified structural engineers.</p>
            </div>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Can I use IoT cameras and drones?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Yes, the Live Detection feature supports standard RTSP feeds, USB webcams, and drone telemetry streams.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem', marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>Core Architecture Team</h2>
          <ProfileCard 
            name="Developer" 
            role="AI & Infrastructure Engineer" 
            description="Leading the development of advanced structural analysis pipelines using Edge AI and deep learning." 
          />
        </section>
      </div>
    </div>
  );
};

export default About;
