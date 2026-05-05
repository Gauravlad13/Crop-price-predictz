import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isPred = payload[0]?.payload?.price_pred && !payload[0]?.payload?.price_hist;
  const val = payload[0]?.value ?? payload[1]?.value;
  return (
    <div className="rounded-2xl px-4 py-3 shadow-xl" style={{background:'var(--ink)',border:'1px solid rgba(255,255,255,0.1)'}}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'rgba(245,243,237,0.45)'}}>{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{background: isPred ? 'var(--marigold)' : 'var(--fern)'}}></span>
        <span className="font-display font-bold text-xl" style={{color:'var(--cream)',letterSpacing:'-0.5px'}}>₹{val?.toLocaleString()}</span>
      </div>
      <p className="text-xs mt-0.5 font-medium" style={{color:'rgba(245,243,237,0.4)'}}>
        {isPred ? 'AI Forecast · /qtl' : 'Market Price · /qtl'}
      </p>
    </div>
  );
};

const PriceChart = ({ data, title }) => (
  <div className="bg-white rounded-4xl p-8 border" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display font-bold text-xl tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>{title || 'Price Intelligence Timeline'}</h2>
        <div className="flex items-center gap-5 mt-1.5">
          {[['var(--fern)', 'Historical'], ['var(--marigold)', 'AI Forecast']].map(([color, lbl]) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{background:color}}></span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{color:'var(--ink-soft)'}}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{top:10,right:4,left:-16,bottom:0}}>
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4a7c59" stopOpacity={0.12}/>
            <stop offset="95%" stopColor="#4a7c59" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f9a620" stopOpacity={0.12}/>
            <stop offset="95%" stopColor="#f9a620" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,35,24,0.05)"/>
        <XAxis dataKey="date" axisLine={false} tickLine={false}
          tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500,fontFamily:'DM Sans'}}
          tickFormatter={s => { const d=new Date(s); return d.toLocaleDateString(undefined,{month:'short',day:'numeric'}); }}
        />
        <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500,fontFamily:'DM Sans'}}/>
        <Tooltip content={<CustomTooltip />} cursor={{stroke:'var(--fern)',strokeWidth:1,strokeDasharray:'4 4'}}/>
        <Area type="monotone" dataKey="price_hist" stroke="var(--fern)" strokeWidth={3}
          fill="url(#histGrad)" fillOpacity={1} connectNulls={false}/>
        <Area type="monotone" dataKey="price_pred" stroke="var(--marigold)" strokeWidth={2.5}
          strokeDasharray="8 5" fill="url(#predGrad)" fillOpacity={1} connectNulls={false}/>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default PriceChart;
