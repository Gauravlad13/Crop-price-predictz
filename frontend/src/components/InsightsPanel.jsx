import React, { useMemo } from 'react';

const TYPE_STYLES = {
  success: { bg:'rgba(74,124,89,0.08)', color:'var(--fern)',  border:'rgba(74,124,89,0.15)' },
  warning: { bg:'rgba(249,166,32,0.08)', color:'#a0720a',    border:'rgba(249,166,32,0.2)' },
  danger:  { bg:'rgba(183,71,42,0.08)', color:'var(--terra)', border:'rgba(183,71,42,0.15)' },
  info:    { bg:'rgba(74,124,89,0.08)', color:'var(--fern)',  border:'rgba(74,124,89,0.15)' },
};

const InsightCard = ({ type='info', text, icon }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.info;
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01]"
      style={{background:s.bg, borderColor:s.border}}>
      <span className="text-lg mt-0.5 shrink-0">{icon}</span>
      <p className="text-xs font-medium leading-relaxed" style={{color:s.color}}>{text}</p>
    </div>
  );
};

const InsightsPanel = ({ prediction, isOverview, dataset }) => {
  const insights = useMemo(() => {
    if (isOverview && dataset?.length) {
      const totals = {}, counts = {};
      dataset.forEach(d => { totals[d.crop]=(totals[d.crop]||0)+d.price; counts[d.crop]=(counts[d.crop]||0)+1; });
      const top = Object.keys(totals).sort((a,b)=>(totals[b]/counts[b])-(totals[a]/counts[a]))[0];
      const locAvg = {};
      dataset.slice(-100).forEach(d => { locAvg[d.location]=(locAvg[d.location]||0)+d.price; });
      const topLoc = Object.keys(locAvg).reduce((a,b)=>locAvg[a]>locAvg[b]?a:b,'');
      return [
        { type:'info',    icon:'🌱', text:`${top?.toUpperCase()} commands the highest average market price. Demand remains elevated for premium varieties.` },
        { type:'success', icon:'📍', text:`${topLoc?.toUpperCase()} shows peak crop valuations. Consider routing produce to this market hub for better returns.` },
        { type:'info',    icon:'📊', text:'Price volatility observed across markets. Tracking weekly trends can significantly improve selling timing.' },
      ];
    }
    if (!prediction) return [];
    const out = [];
    const diff = prediction.predicted_price - prediction.previous_price;
    const isUp = diff > 0;
    out.push({
      type: isUp ? 'success' : 'danger',
      icon: isUp ? '📈' : '📉',
      text: `Price ${isUp?'rise':'drop'} of ₹${Math.abs(diff).toFixed(0)}/qtl predicted. ${isUp?'Consider holding stock to benefit.':'Early selling may be advisable.'}`
    });
    const w = prediction.weather;
    if (w) {
      if (w.rain < 4)  out.push({ type:'warning', icon:'☀️', text:'Very low rainfall forecast. Supply scarcity may push prices higher in the short term.' });
      else if (w.rain > 15) out.push({ type:'danger', icon:'🌧️', text:'Heavy rainfall expected. Harvest disruption may cause temporary price softening.' });
      if (w.temp > 36) out.push({ type:'warning', icon:'🌡️', text:`High temperature (${w.temp}°C) alert. Heat stress may reduce crop quality and market valuation.` });
      if (w.hum > 80)  out.push({ type:'warning', icon:'💧', text:'High humidity detected. Fungal risk may affect crop quality — ensure proper storage.' });
    }
    out.push({ type:'info', icon:'✦', text:`Optimal sell window: Plan around the highest forecasted day. Check the 7-day chart for peak timing.` });
    return out;
  }, [prediction, isOverview, dataset]);

  return (
    <div className="bg-white rounded-4xl p-7 border h-full" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{background:'rgba(74,124,89,0.1)'}}>✦</div>
        <h2 className="font-display font-bold text-lg tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>Market Intelligence</h2>
      </div>
      <div className="space-y-3">
        {insights.map((ins, i) => <InsightCard key={i} {...ins}/>)}
        {!insights.length && (
          <p className="text-sm text-center py-8" style={{color:'var(--ink-soft)'}}>Run a forecast to see AI insights</p>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
