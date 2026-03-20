import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Video, UploadCloud, Activity, Building2, Navigation, Zap, Map } from 'lucide-react';
import GradientText from '../components/animations/GradientText';
import Typewriter from '../components/animations/Typewriter';
import RotatingText from '../components/animations/RotatingText';
import CountUp from '../components/animations/CountUp';
import ScrollVelocity from '../components/animations/ScrollVelocity';
import StarBorder from '../components/animations/StarBorder';
import LogoLoop from '../components/animations/LogoLoop';
import FadeInSection from '../components/animations/FadeInSection';
import ScrollFloat from '../components/animations/ScrollFloat';
import GradualBlur from '../components/animations/GradualBlur';

const Home = () => {
  return (
    <>
    <div className="page-container" style={{ paddingBottom: 0 }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Predict and Prevent <br />
            <RotatingText words={['Structural Failures', 'Costly Repairs', 'Safety Hazards']} />
          </h1>
          <Typewriter className="hero-subtitle" text="Use advanced visual analysis and deep learning to instantly evaluate structural integrity and prevent catastrophic infrastructural failures." />
          
          <div className="hero-features">
             <span className="hero-feature-item"><Activity size={16} color="#2563eb" /> High Precision</span>
             <span className="hero-feature-item"><ShieldAlert size={16} color="#2563eb" /> Edge Computing</span>
             <span className="hero-feature-item"><Activity size={16} color="#2563eb" /> Real-Time Analytics</span>
          </div>

          <div className="hero-actions">
            <Link to="/live">
              <StarBorder>
                <div style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', fontWeight: 500, borderRadius: '0.3rem' }}>
                  Start Live Detection
                </div>
              </StarBorder>
            </Link>
            <Link to="/import" className="btn-outline">Talk to an Expert</Link>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-card">
            <div className="hero-graphic">
               <img src="/hero-crack.png" alt="AI Crack Detection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="hero-card-footer">
               <h4 style={{ color: '#2563eb', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>Surface Crack Analysis</h4>
               <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.4 }}>Detect and classify microscopic surface anomalies before they compromise structural stability.</p>
            </div>
            
            <div className="floating-badge badge-left">
              <ShieldAlert size={20} color="#10b981" />
            </div>
            <div className="floating-badge badge-right">
              <Activity size={20} color="#10b981" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <FadeInSection delay={0.1} yOffset={20}>
        <section style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '2rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}><CountUp end={99} suffix="%" /></h3>
            <p style={{ color: 'var(--text-muted)' }}>Detection Accuracy</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}><CountUp end={10} suffix="M+" /></h3>
            <p style={{ color: 'var(--text-muted)' }}>Images Analyzed</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}><CountUp end={50} suffix="ms" /></h3>
            <p style={{ color: 'var(--text-muted)' }}>Inference Time</p>
          </div>
        </section>
      </FadeInSection>

      {/* Expanded Content: How it Works */}
      <FadeInSection delay={0.2} yOffset={40}>
        <section style={{ marginTop: '8rem', maxWidth: '1000px', margin: '8rem auto 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4rem', textAlign: 'center' }}>How Krak.AI Works</h2>
          <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Image Acquisition & IoT Integration</h3>
                <p style={{ color: 'var(--text-muted)' }}>Whether uploading structural blueprints offline or streaming live 4K drone footage via RTSP, our ingestion engine normalizes the visual data instantly.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Wavelet Transform Pre-Processing</h3>
                <p style={{ color: 'var(--text-muted)' }}>Images are heavily filtered using 2D Discrete Wavelet Transforms (DWT). This significantly emphasizes the high-frequency edge features of microscopic anomalies while ignoring generic concrete noise.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>MobileNetV2 Inference</h3>
                <p style={{ color: 'var(--text-muted)' }}>The filtered layers are pushed through an optimized MobileNetV2 architecture. At sub-50ms inference times, the network draws bounding boxes and calculates exact degradation severity.</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Features Grid */}
      <FadeInSection delay={0.2} yOffset={40}>
        <ScrollFloat offset={50}>
          <section className="feature-grid" style={{ marginTop: '8rem' }}>
            <div className="feature-card">
              <div className="feature-icon"><Video size={24} color="#2563eb" /></div>
              <h3 className="feature-title">Real-Time Analysis</h3>
              <p className="feature-desc">Connect your camera feed for instant surface crack detection and continuous monitoring.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><UploadCloud size={24} color="#2563eb" /></div>
              <h3 className="feature-title">Batch Import</h3>
              <p className="feature-desc">Upload existing images or video footage for comprehensive batch analysis of structural assets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Activity size={24} color="#2563eb" /></div>
              <h3 className="feature-title">AI-Powered Precision</h3>
              <p className="feature-desc">Utilizing Wavelet Transforms and CNNs (MobileNetV2) to deliver highly accurate crack detection.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldAlert size={24} color="#2563eb" /></div>
              <h3 className="feature-title">Predictive Maintenance</h3>
              <p className="feature-desc">Identify micro-fissures before they become critical failures, mapping potential weaknesses across your infrastructure.</p>
            </div>
          </section>
        </ScrollFloat>
      </FadeInSection>
      
      {/* Industries Served */}
      <FadeInSection delay={0.2} yOffset={40}>
        <section style={{ marginTop: '8rem', maxWidth: '1200px', margin: '8rem auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Built for Critical Infrastructure</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>From commercial real estate to energy pipelines, Krak.AI adapts to the unique structural demands of any industry.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <Building2 size={48} color="#2563eb" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Commercial Buildings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monitor foundation integrity and load-bearing walls across massive real estate portfolios.</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <Navigation size={48} color="#2563eb" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Bridges & Overpasses</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Detect critical stress fractures in steel and concrete spans before they escalate.</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <Map size={48} color="#2563eb" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Tunnels & Subways</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ensure subterranean safety with low-light optimized crack detection and water-ingress spotting.</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <Zap size={48} color="#2563eb" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Pipelines & Energy</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Maintain the structural health of critical energy conduits and power generation facilities.</p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Bottom CTA */}
      <FadeInSection delay={0.1} yOffset={30}>
        <section style={{ marginTop: '8rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', borderRadius: '1.5rem', padding: '5rem 2rem', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ready to Modernize Your Inspections?</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 3rem' }}>Join the industry leaders leveraging visual AI to detect, track, and predict structural degradation.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/live" style={{ background: 'white', color: '#1e3a8a', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: 600, display: 'inline-block' }}>Start Free Trial</Link>
            <Link to="/about" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: 600, display: 'inline-block' }}>Read More</Link>
          </div>
        </section>
      </FadeInSection>

      {/* Logos loop */}
      <FadeInSection delay={0.1} yOffset={20}>
        <section style={{ marginTop: '8rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Integrated with Core Technologies</h2>
          <LogoLoop>
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>React</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>Vite</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>PyTorch</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>OpenCV</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>Wavelet Transform</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4b5563' }}>MobileNetV2</span>
            </div>
          </LogoLoop>
        </section>
      </FadeInSection>
    </div>
    
    <div style={{ marginTop: '4rem' }}>
      <GradualBlur>
        <ScrollVelocity text="Real-Time AI Crack Detection • High Precision • " velocity={10} />
      </GradualBlur>
    </div>
    </>
  );
};

export default Home;
