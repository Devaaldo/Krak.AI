import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ name, role, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,249,255,1) 100%)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        boxShadow: '0 20px 40px -15px rgba(37,99,235,0.1)',
        border: '1px solid rgba(37,99,235,0.1)',
        textAlign: 'center',
        perspective: '1000px',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <div style={{
         width: '96px', height: '96px', borderRadius: '50%', background: '#2563eb', margin: '0 auto 1.5rem',
         display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold'
      }}>
         {name.charAt(0)}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{name}</h3>
      <div style={{ color: 'var(--primary-color)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '1rem' }}>{role}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{description}</p>
    </motion.div>
  );
};

export default ProfileCard;
