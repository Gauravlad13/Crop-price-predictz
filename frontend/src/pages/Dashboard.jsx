import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import MarketBarChart from '../components/MarketBarChart';
import InsightsPanel from '../components/InsightsPanel';

const API_BASE = 'http://localhost:5000';

export default function Dashboard() {
  const [recentData, setRecentData] = useState([]);
  const [barData, setBarData]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [weather, setWeather]       = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [histRes, weatherRes] = await Promise.all([
          axios.get(`${API_BASE}/history?limit=200`),
          axios.get(`${API_BASE}/weather?location=mumbai`),
        ]);
        const data = Array.isArray(histRes.data) ? histRes.data : [];
        setRecentData(data.slice(0, 50));
        setWeather(weatherRes.data);

        // Build bar chart: avg price per crop
        const totals = {}, counts = {};
        data.forEach(d => {
          if (!d.crop) return;
          totals[d.crop] = (totals[d.crop] || 0) + d.price;
          counts[d.crop] = (counts[d.crop] || 0) + 1;
        });
        const bars = Object.keys(totals)
          .map(c => ({ name: c.length > 12 ? c.slice(0,12)+'…' : c, price: Math.round(totals[c]/counts[c]) }))
          .sort((a,b) => b.price - a.price)
          .slice(0, 7);
        setBarData(bars);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const prices  = recentData.map(d => d.price).filter(Boolean);
  const maxP    = prices.length ? Math.max(...prices) : 0;
  const minP    = prices.length ? Math.min(...prices) : 0;
  const avgP    = prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0;
  const topCrop = recentData.length ? recentData.find(d => d.price === maxP)?.crop || '—' : '—';

  if (loading) return (
    <main className="p-10 animate-fade-in">
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[...Array(4)].map((_,i) => (
          <div key={i} className="h-32 rounded-3xl animate-pulse" style={{background:'rgba(74,124,89,0.06)'}}/>
        ))}
      </div>
    </main>
  );

  return (
    <main className="p-10 space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard title="Highest Price" value={`₹${maxP.toLocaleString()}`} label="qtl" icon="📈" isPositive change={12.4}/>
        <StatCard title="Lowest Price"  value={`₹${minP.toLocaleString()}`} label="qtl" icon="📉" isPositive={false} change={4.2}/>
        <StatCard title="Avg Market Price" value={`₹${avgP.toLocaleString()}`} icon="📊" isPositive change={2.1}/>
        {weather && (
          <StatCard title="Mumbai Weather" value={`${weather.temp}°C`} label={`${weather.hum}% hum`} icon="🌡️" isPositive/>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <MarketBarChart data={barData} title="Average Price by Commodity"/>
        </div>
        <InsightsPanel isOverview dataset={recentData}/>
      </div>

      {/* Recent table */}
      <div className="bg-white rounded-4xl border overflow-hidden" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
        <div className="px-8 py-6 flex items-center justify-between border-b" style={{borderColor:'rgba(74,124,89,0.07)'}}>
          <div>
            <h3 className="font-display font-bold text-xl tracking-tight" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>Recent Market Updates</h3>
            <p className="text-xs mt-1 font-medium uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>Latest prices across all markets</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{background:'rgba(74,124,89,0.1)',color:'var(--fern)'}}>
            {recentData.length} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{background:'var(--cream)'}}>
                {['Crop','Location','State','Date','Min','Max','Modal Price'].map(h=>(
                  <th key={h} className="px-7 py-3 text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentData.slice(0,15).map((row,i)=>(
                <tr key={i} className="transition-colors" style={{borderTop:'1px solid rgba(245,243,237,0.8)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="px-7 py-3.5">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase" style={{color:'var(--fern)'}}>
                      <span className="w-2 h-2 rounded-full" style={{background:'var(--fern)'}}/>
                      {row.crop}
                    </span>
                  </td>
                  <td className="px-7 py-3.5 text-xs font-semibold uppercase" style={{color:'var(--ink-mid)'}}>{row.location}</td>
                  <td className="px-7 py-3.5 text-xs" style={{color:'var(--ink-soft)'}}>{row.state}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold" style={{color:'var(--ink)'}}>{row.date}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold" style={{color:'var(--ink-soft)'}}>₹{row.min_price}</td>
                  <td className="px-7 py-3.5 text-xs font-semibold" style={{color:'var(--ink-soft)'}}>₹{row.max_price}</td>
                  <td className="px-7 py-3.5 font-display font-bold" style={{color:'var(--ink)'}}>₹{row.price?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
