import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',   icon: '⊞', label: 'Dashboard' },
  { to: '/predictions', icon: '◈', label: 'Price Forecast' },
  { to: '/history',     icon: '◷', label: 'Price History' },
  { to: '/profile',     icon: '◎', label: 'My Profile' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50"
      style={{background:'var(--ink)'}}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-7 py-8 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'var(--fern)'}}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{fill:'var(--cream)'}}>
            <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C7.77 19 9 17 9 16c3.35 0 7.19-.62 9-3.97C18.8 10.54 17.6 8 17 8ZM7 20h2c0-.93.19-1.83.5-2.7-.59.2-1.17.43-1.68.7H7V20ZM18 3c0 1.86-.68 3.57-1.8 4.9C15.1 5.89 13 4 13 4s0 4-2 6c-.76 1.24-2 2-2 2s0-3-2-3-2 3-2 3c0 2.41.96 4.55 2.5 6.06.25-1 .5-2.06.5-3.06 1.23 0 3.28 0 5-3 1-2 3-4 3-6s3-5 3-5Z"/>
          </svg>
        </div>
        <div>
          <div className="font-display font-bold text-lg italic" style={{color:'var(--cream)'}}>AgroPredict</div>
          <div className="text-xs uppercase tracking-widest" style={{color:'var(--fern-light)',fontSize:'9px'}}>Crop Price System</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{color:'rgba(245,243,237,0.25)',fontSize:'9px'}}>Main</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all duration-200 border ${
                isActive
                  ? 'border-fern/30 text-cream'
                  : 'border-transparent hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive
              ? { background:'rgba(74,124,89,0.18)', color:'var(--cream)' }
              : { color:'rgba(245,243,237,0.5)' }
            }
          >
            <span className="w-5 text-center text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 border-t pt-4" style={{borderColor:'rgba(255,255,255,0.06)'}}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all duration-200"
          style={{color:'rgba(183,71,42,0.7)'}}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(183,71,42,0.1)';e.currentTarget.style.color='var(--terra)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(183,71,42,0.7)'}}
        >
          <span>↩</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
