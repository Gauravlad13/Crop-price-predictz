import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#4a7c59','#f9a620','#b7472a','#7aad8a','#ffd166','#2d5c3e'];

const MarketBarChart = ({ data, title }) => (
  <div className="bg-white rounded-4xl p-8 border" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
    <div className="mb-5">
      <h2 className="font-display font-bold text-xl tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>{title}</h2>
      <p className="text-xs font-medium uppercase tracking-widest mt-1" style={{color:'var(--ink-soft)'}}>Average modal price per commodity</p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{top:4,right:4,left:-16,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,35,24,0.05)"/>
        <XAxis dataKey="name" axisLine={false} tickLine={false}
          tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500}}/>
        <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500}}/>
        <Tooltip
          cursor={{fill:'rgba(74,124,89,0.04)'}}
          contentStyle={{borderRadius:'14px',border:'1px solid rgba(74,124,89,0.1)',fontFamily:'DM Sans',fontWeight:600,boxShadow:'0 8px 30px rgba(26,35,24,0.12)'}}
        />
        <Bar dataKey="price" radius={[8,8,0,0]} barSize={36}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MarketBarChart;
