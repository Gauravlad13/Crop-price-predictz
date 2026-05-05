import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PredictionHistory from '../components/PredictionHistory';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:5000';

export default function HistoryPage() {
  const [history,    setHistory]    = useState([]);
  const [predHist,   setPredHist]   = useState([]);
  const [crops,      setCrops]      = useState([]);
  const [locations,  setLocations]  = useState([]);
  const [selection,  setSelection]  = useState({ crop:'', location:'' });
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/options`).then(res => {
      const opts = res.data;
      setCrops(opts.crops || []);
      const defCrop = opts.crops?.includes('Tomato') ? 'Tomato' : opts.crops?.[0] || '';
      setSelection(s => ({ ...s, crop: defCrop }));
    }).catch(() => {});

    axios.get(`${API_BASE}/prediction-history`).then(res => {
      setPredHist(res.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selection.crop) return;
    axios.get(`${API_BASE}/options?crop=${encodeURIComponent(selection.crop)}`).then(res => {
      const locs = res.data.locations || [];
      setLocations(locs);
      setSelection(s => ({ ...s, location: locs.includes(s.location) ? s.location : locs[0] || '' }));
    }).catch(() => {});
  }, [selection.crop]);

  useEffect(() => {
    if (!selection.crop || !selection.location) return;
    setLoading(true);
    axios.get(`${API_BASE}/history?crop=${encodeURIComponent(selection.crop)}&location=${encodeURIComponent(selection.location)}`)
      .then(res => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selection.crop, selection.location]);

  const chartData = history.slice(-60).map(d => ({ date: d.date, price: d.price }));

  return (
    <main className="p-10 space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { key:'crop',     opts: crops,     label:'Commodity' },
          { key:'location', opts: locations, label:'Market' },
        ].map(({ key, opts, label }) => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{color:'var(--ink-soft)'}}>{label}</label>
            <select value={selection[key]} onChange={e=>setSelection({...selection,[key]:e.target.value})}
              className="px-5 py-2.5 rounded-2xl text-sm font-medium outline-none appearance-none cursor-pointer transition-all duration-200"
              style={{background:'#fff',border:'2px solid rgba(74,124,89,0.12)',color:'var(--ink)',fontFamily:'DM Sans',boxShadow:'0 2px 8px rgba(26,35,24,0.05)'}}
              onFocus={e=>e.target.style.borderColor='var(--fern)'} onBlur={e=>e.target.style.borderColor='rgba(74,124,89,0.12)'}>
              {(opts||[]).map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {loading && <span className="text-xs font-medium animate-pulse mt-6" style={{color:'var(--fern)'}}>Loading…</span>}
      </div>

      {/* Area chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-4xl p-8 border" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
          <h3 className="font-display font-bold text-xl mb-6 tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>
            {selection.crop} · {selection.location} <em className="font-display" style={{color:'var(--fern)'}}>Price Trend</em>
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{top:4,right:4,left:-16,bottom:0}}>
              <defs>
                <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4a7c59" stopOpacity={0.14}/>
                  <stop offset="95%" stopColor="#4a7c59" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,35,24,0.05)"/>
              <XAxis dataKey="date" axisLine={false} tickLine={false}
                tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500}}
                tickFormatter={s=>{const d=new Date(s);return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--ink-soft)',fontSize:10,fontWeight:500}}/>
              <Tooltip
                contentStyle={{borderRadius:'14px',border:'1px solid rgba(74,124,89,0.1)',fontFamily:'DM Sans',fontWeight:600,boxShadow:'0 8px 30px rgba(26,35,24,0.12)'}}/>
              <Area type="monotone" dataKey="price" stroke="var(--fern)" strokeWidth={2.5} fill="url(#hg2)" fillOpacity={1}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Saved forecasts */}
      <PredictionHistory predictions={predHist}/>

      {/* Market dataset table */}
      <div className="bg-white rounded-4xl border overflow-hidden" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{borderColor:'rgba(74,124,89,0.07)'}}>
          <h3 className="font-display font-bold text-lg tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>Market Dataset</h3>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>{history.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{background:'var(--cream)'}}>
                {['Date','Commodity','Market','State','Min','Max','Modal Price'].map(h=>(
                  <th key={h} className="px-7 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length ? history.slice().reverse().slice(0,30).map((row,i)=>(
                <tr key={i} className="transition-colors" style={{borderTop:'1px solid rgba(245,243,237,0.8)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="px-7 py-3.5 text-sm font-semibold" style={{color:'var(--ink)'}}>{row.date}</td>
                  <td className="px-7 py-3.5 text-xs font-bold uppercase" style={{color:'var(--fern)'}}>{row.crop}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold uppercase" style={{color:'var(--ink-mid)'}}>{row.location}</td>
                  <td className="px-7 py-3.5 text-xs" style={{color:'var(--ink-soft)'}}>{row.state}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold" style={{color:'var(--ink-soft)'}}>₹{row.min_price}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold" style={{color:'var(--ink-soft)'}}>₹{row.max_price}</td>
                  <td className="px-7 py-3.5 font-display font-bold" style={{color:'var(--ink)'}}>₹{row.price?.toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-7 py-12 text-center text-sm" style={{color:'var(--ink-soft)'}}>Select a crop and market to view records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
