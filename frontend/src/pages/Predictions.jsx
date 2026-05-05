import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceChart from '../components/PriceChart';
import InsightsPanel from '../components/InsightsPanel';

const API_BASE = 'http://localhost:5000';

const WeatherBadge = ({ weather }) => {
  if (!weather) return null;
  return (
    <div className="flex items-center gap-6 px-8 py-5 rounded-3xl" style={{background:'var(--ink)'}}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:'rgba(74,124,89,0.2)'}}>🌤</div>
      <div className="flex gap-10 flex-1">
        {[['Temperature',`${weather.temp}°C`],['Rainfall',`${weather.rain}mm`],['Humidity',`${weather.hum}%`]].map(([l,v])=>(
          <div key={l}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{color:'var(--fern-light)'}}>{l}</p>
            <p className="font-display font-bold text-2xl" style={{color:'var(--cream)',letterSpacing:'-0.5px'}}>{v}</p>
          </div>
        ))}
      </div>
      <span className="text-xs font-medium uppercase tracking-widest" style={{color:'rgba(245,243,237,0.3)'}}>Live Weather · Market Area</span>
    </div>
  );
};

export default function Predictions() {
  const [options, setOptions]       = useState({ crops:[], locations:[], default_prediction_date:'' });
  const [form, setForm]             = useState({ crop:'', location:'', date:'' });
  const [prediction, setPrediction] = useState(null);
  const [chartData, setChartData]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/options`).then(res => {
      const opts = res.data;
      setOptions(opts);
      const defCrop = opts.crops.includes('Tomato') ? 'Tomato' : opts.crops[0] || '';
      setForm(f => ({ ...f, crop: defCrop, date: opts.default_prediction_date || '' }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.crop) return;
    axios.get(`${API_BASE}/options?crop=${encodeURIComponent(form.crop)}`).then(res => {
      const locs = res.data.locations || [];
      setOptions(o => ({ ...o, locations: locs }));
      setForm(f => ({ ...f, location: locs.includes(f.location) ? f.location : locs[0] || '' }));
    }).catch(() => {});
  }, [form.crop]);

  const handlePredict = async () => {
    if (!form.crop || !form.location) return;
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/predict`, form);
      const p = res.data;
      setPrediction(p);

      // Build chart data: blend history + forecast
      const histRes = await axios.get(
        `${API_BASE}/history?crop=${encodeURIComponent(form.crop)}&location=${encodeURIComponent(form.location)}`
      );
      const hist = Array.isArray(histRes.data) ? histRes.data : [];
      const histPts = hist.slice(-14).map(d => ({ date: d.date, price_hist: d.price }));
      const predPts = (p.predictions_range || []).map(r => ({ date: r.date, price_pred: r.price }));
      // Connect: last hist point repeated as first pred point
      const bridge = histPts.length ? [{ date: histPts[histPts.length-1].date, price_hist: histPts[histPts.length-1].price_hist, price_pred: histPts[histPts.length-1].price_hist }] : [];
      setChartData([...histPts.slice(0,-1), ...bridge, ...predPts]);
    } catch (e) {
      setError(e.response?.data?.msg || 'Prediction failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className="p-10 space-y-6 animate-fade-in">
      {/* Form Card */}
      <div className="bg-white rounded-4xl p-8 border" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
        <h2 className="font-display font-bold text-xl mb-5" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>Configure Prediction</h2>
        <div className="flex items-end gap-4 flex-wrap">
          {[
            { label:'Commodity', key:'crop', type:'select', opts: options.crops },
            { label:'Mandi Market', key:'location', type:'select', opts: options.locations },
            { label:'Target Date', key:'date', type:'date' },
          ].map(({ label, key, type, opts }) => (
            <div key={key} className="flex-1 min-w-44">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--ink-soft)'}}>{label}</label>
              {type === 'select' ? (
                <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none appearance-none cursor-pointer transition-all duration-200"
                  style={{background:'var(--cream)',border:'2px solid transparent',color:'var(--ink)',fontFamily:'DM Sans'}}
                  onFocus={e=>{e.target.style.borderColor='var(--fern)';e.target.style.background='#fff'}}
                  onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='var(--cream)'}}>
                  {(opts||[]).map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type="date" value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
                  style={{background:'var(--cream)',border:'2px solid transparent',color:'var(--ink)',fontFamily:'DM Sans'}}
                  onFocus={e=>{e.target.style.borderColor='var(--fern)';e.target.style.background='#fff'}}
                  onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='var(--cream)'}}
                />
              )}
            </div>
          ))}
          <button onClick={handlePredict} disabled={loading}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap"
            style={{background:'var(--fern)',color:'var(--cream)',boxShadow:'0 8px 24px rgba(74,124,89,0.28)',fontFamily:'DM Sans'}}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.background='var(--fern-dark)';e.currentTarget.style.transform='translateY(-1px)'}}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--fern)';e.currentTarget.style.transform='translateY(0)'}}>
            {loading ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:'rgba(245,243,237,0.3)',borderTopColor:'var(--cream)'}}/> : '✦ Run Forecast'}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 rounded-xl text-sm" style={{background:'rgba(183,71,42,0.08)',color:'var(--terra)',border:'1px solid rgba(183,71,42,0.2)'}}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {prediction ? (
        <>
          <WeatherBadge weather={prediction.weather}/>

          {/* Price summary cards */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1 rounded-3xl p-7 flex flex-col justify-between" style={{background:'linear-gradient(135deg,var(--fern-dark),var(--fern))'}}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'rgba(245,243,237,0.6)'}}>Predicted Market Price</p>
              <div>
                <div className="font-display font-black mt-3 mb-3" style={{fontSize:'48px',color:'var(--cream)',letterSpacing:'-2px',lineHeight:1}}>
                  ₹{prediction.predicted_price?.toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{background:'rgba(249,166,32,0.2)',color:'var(--marigold-light)'}}>
                  ↑ vs ₹{prediction.previous_price?.toLocaleString()} last price
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-7 border flex flex-col justify-between" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>Last Known Price</p>
              <div className="font-display font-black text-4xl mt-2" style={{color:'var(--ink)',letterSpacing:'-1.5px'}}>
                ₹{prediction.previous_price?.toLocaleString()}
              </div>
              <p className="text-xs mt-1" style={{color:'var(--ink-soft)'}}>Last updated: {prediction.last_updated}</p>
            </div>
            <div className="bg-white rounded-3xl p-7 border flex flex-col justify-between" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--ink-soft)'}}>AI Confidence</p>
              <div className="font-display font-black text-4xl mt-2" style={{color:'var(--fern)',letterSpacing:'-1.5px'}}>{prediction.confidence}</div>
              <div className="mt-3 rounded-full h-2 overflow-hidden" style={{background:'var(--cream-dark)'}}>
                <div className="h-full rounded-full transition-all duration-1000" style={{width:prediction.confidence,background:'linear-gradient(90deg,var(--fern),var(--marigold))'}}/>
              </div>
            </div>
          </div>

          {/* Chart + Insights */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <PriceChart data={chartData} title={`${form.crop} Price Pathway · ${form.location}`}/>
            </div>
            <InsightsPanel prediction={prediction}/>
          </div>

          {/* 7-day forecast table */}
          <div className="bg-white rounded-4xl border overflow-hidden" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
            <div className="px-8 py-5 border-b" style={{borderColor:'rgba(74,124,89,0.07)'}}>
              <h3 className="font-display font-bold text-lg" style={{color:'var(--ink)',letterSpacing:'-0.3px'}}>7-Day Price Forecast</h3>
            </div>
            <div className="grid grid-cols-7">
              {(prediction.predictions_range || []).map((r, i) => (
                <div key={r.date} className="p-5 text-center border-r last:border-r-0 transition-all duration-200"
                  style={{borderColor:'rgba(74,124,89,0.07)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <p className="text-xs font-medium mb-2" style={{color:'var(--ink-soft)'}}>
                    {new Date(r.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}
                  </p>
                  <p className="font-display font-black text-lg" style={{color: i===0?'var(--fern)':'var(--ink)',letterSpacing:'-0.5px'}}>₹{r.price?.toLocaleString()}</p>
                  {i===0 && <span className="text-xs font-bold" style={{color:'var(--marigold)'}}>Today</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-white rounded-4xl border-2 border-dashed" style={{borderColor:'rgba(74,124,89,0.15)'}}>
          <div className="text-6xl mb-5 opacity-30">◈</div>
          <h3 className="font-display font-bold text-2xl mb-3" style={{color:'var(--ink)',letterSpacing:'-0.5px'}}>Predictive Terminal Ready</h3>
          <p className="text-sm" style={{color:'var(--ink-soft)'}}>Select a commodity and mandi market above to initialize the AI forecasting workflow.</p>
        </div>
      )}
    </main>
  );
}
