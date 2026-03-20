import React from 'react';
import { UploadCloud, Image as ImageIcon, FileVideo } from 'lucide-react';
import CardSwap from '../components/animations/CardSwap';

const ImportPage = () => {
  const FrontCard = (
    <div className="upload-area" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <UploadCloud size={48} className="upload-icon" />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Drag & drop your Image Files</h3>
      <p style={{ color: 'var(--text-muted)' }}>Click to Upload Video Instead</p>
    </div>
  );

  const BackCard = (
    <div className="upload-area" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderColor: '#2563eb', backgroundColor: '#eff6ff' }}>
      <FileVideo size={48} color="#2563eb" className="upload-icon" />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#2563eb' }}>Drag & drop your Video Files</h3>
      <p style={{ color: '#3b82f6' }}>Click to Upload Image Instead</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Import Data</h1>
        <p className="dashboard-desc">Run batch analysis on high-resolution image and video datasets.</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', height: '300px' }}>
        <CardSwap frontContent={FrontCard} backContent={BackCard} />
      </div>
    </div>
  );
};

export default ImportPage;
