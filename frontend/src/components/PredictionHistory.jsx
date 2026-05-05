import React from 'react';

const PredictionHistory = ({ predictions = [] }) => (
  <div className="bg-white rounded-4xl border overflow-hidden" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
    <div className="px-8 py-5 flex items-center justify-between border-b" style={{borderColor:'rgba(74,124,89,0.07)'}}>
      <h2 className="font-display font-bold text-lg tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>Saved Forecasts</h2>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>{predictions.length} Records</span>
    </div>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr style={{background:'var(--cream)'}}>
          {['Target Date','Commodity','Market','Predicted Price','Saved At'].map(h => (
            <th key={h} className="px-7 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {predictions.length ? predictions.slice(0,8).map(row => (
          <tr key={row.id} className="transition-colors" style={{borderTop:'1px solid rgba(245,243,237,0.8)'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <td className="px-7 py-4 text-sm font-semibold" style={{color:'var(--ink)'}}>{row.target_date}</td>
            <td className="px-7 py-4 text-xs font-bold uppercase tracking-wide" style={{color:'var(--fern)'}}>{row.crop}</td>
            <td className="px-7 py-4 text-xs font-semibold uppercase" style={{color:'var(--ink-mid)'}}>{row.location}</td>
            <td className="px-7 py-4 font-display font-bold" style={{color:'var(--ink)'}}>₹{row.predicted_price?.toLocaleString()}</td>
            <td className="px-7 py-4 text-xs" style={{color:'var(--ink-soft)'}}>{new Date(row.created_at).toLocaleString()}</td>
          </tr>
        )) : (
          <tr>
            <td colSpan="5" className="px-7 py-12 text-center text-sm" style={{color:'var(--ink-soft)'}}>
              Your saved predictions will appear here after running forecasts.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default PredictionHistory;
