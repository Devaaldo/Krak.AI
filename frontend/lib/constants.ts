export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const WS_BASE = API_BASE.replace(/^http/, 'ws');

export const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Detect Crack', href: '/detect', icon: 'detect' },
  { label: 'Predict', href: '/predict', icon: 'predict' },
  { label: 'About', href: '/about', icon: 'about' },
] as const;
