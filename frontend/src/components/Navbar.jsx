import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TITLES = {
  '/dashboard':   { title: 'Crop Price Dashboard',  sub: 'Real-time agriculture market monitoring' },
  '/predictions': { title: 'Price Forecasting',      sub: 'AI · Mandi Data Engine · Climate Factors' },
  '/history':     { title: 'Price History',           sub: 'Historical mandi records & saved forecasts' },
  '/profile':     { title: 'My Profile',              sub: 'Manage your account settings' },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const info = TITLES[pathname] || { title: 'AgroPredict', sub: '' };
  const [title, ...italicPart] = info.title.split(' ');

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-10 py-5 border-b"
      style={{
        background: isDark ? 'rgba(10,10,15,0.88)' : 'rgba(245,243,237,0.90)',
        backdropFilter: 'blur(16px)',
        borderColor: isDark ? 'rgba(0,102,255,0.2)' : 'rgba(74,124,89,0.1)',
      }}>
      <div>
        <h1 className="font-display font-black text-2xl tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.5px'}}>
          {title} <em className="font-display" style={{color:'var(--fern)'}}>{italicPart.join(' ')}</em>
        </h1>
        <p className="text-xs font-medium uppercase tracking-widest mt-0.5" style={{color:'var(--ink-soft)'}}>{info.sub}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* ── Theme Toggle ── */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to Botanical (Light)' : 'Switch to Midnight Galaxy (Dark)'}
          className="theme-toggle w-12 h-6 rounded-full relative border flex items-center"
          style={{
            background: isDark
              ? 'linear-gradient(135deg,#2b1e3e,#4a4e8f)'
              : 'rgba(74,124,89,0.12)',
            borderColor: isDark ? 'rgba(164,144,194,0.5)' : 'rgba(74,124,89,0.25)',
            boxShadow: isDark ? '0 0 12px rgba(164,144,194,0.3)' : 'none',
          }}
          aria-label="Toggle theme"
        >
          {/* Track icons */}
          <span className="absolute left-1 text-xs" style={{fontSize:'10px'}}>🌿</span>
          <span className="absolute right-1 text-xs" style={{fontSize:'10px'}}>🌌</span>
          {/* Thumb */}
          <span
            className="absolute w-4 h-4 rounded-full shadow-md transition-all duration-300"
            style={{
              left: isDark ? 'calc(100% - 20px)' : '4px',
              background: isDark ? '#a490c2' : 'var(--fern)',
              boxShadow: isDark ? '0 0 8px rgba(164,144,194,0.7)' : '0 1px 4px rgba(0,0,0,0.2)',
            }}
          />
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold" style={{color:'var(--ink)'}}>{user.name}</p>
              <p className="text-xs" style={{color:'var(--ink-soft)'}}>{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg"
              style={{background:'var(--marigold)',color: isDark ? '#0a0a0f' : 'var(--ink)'}}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
