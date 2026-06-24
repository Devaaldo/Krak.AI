import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Activity size={24} color="#2563eb" />
          Krak.AI
        </Link>
        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/live" className={isActive('/live')}>Live</Link>
          <Link to="/import" className={isActive('/import')}>Import</Link>
          <Link to="/assistant" className={isActive('/assistant')}>Assistant</Link>
          <Link to="/projects" className={isActive('/projects')}>Projects</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
