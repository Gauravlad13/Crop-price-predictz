import React from 'react';

const StatCard = ({ title, value, change, label, icon, isPositive = true }) => (
  <div className="card-3d bg-white rounded-3xl p-6 border"
    style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
        style={{background: isPositive ? 'rgba(74,124,89,0.1)' : 'rgba(183,71,42,0.1)'}}>
        {icon}
      </div>
      {change !== undefined && (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: isPositive ? 'rgba(74,124,89,0.1)' : 'rgba(183,71,42,0.1)',
            color: isPositive ? 'var(--fern)' : 'var(--terra)'
          }}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="font-display font-black text-3xl tracking-tight" style={{color:'var(--ink)',letterSpacing:'-1px'}}>
      {value}
    </div>
    <div className="text-xs font-semibold uppercase tracking-widest mt-1.5" style={{color:'var(--ink-soft)'}}>
      {title}{label ? ` · ${label}` : ''}
    </div>
  </div>
);

export default StatCard;
