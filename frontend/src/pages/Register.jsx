import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register`, form);
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.msg || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative" style={{background:'var(--cream)'}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(74,124,89,0.06) 0%,transparent 60%)'}}/>
      <div className="w-full max-w-3xl bg-white rounded-5xl flex overflow-hidden relative z-10"
        style={{boxShadow:'0 40px 100px rgba(26,35,24,0.12)',minHeight:'600px'}}>
        {/* Left panel */}
        <div className="w-5/12 flex flex-col justify-between p-12 relative overflow-hidden" style={{background:'var(--fern)'}}>
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full" style={{background:'rgba(255,255,255,0.05)'}}/>
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full" style={{background:'rgba(0,0,0,0.06)'}}/>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.18)'}}>
              <svg viewBox="0 0 24 24" className="w-6 h-6" style={{fill:'var(--cream)'}}><path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C7.77 19 9 17 9 16c3.35 0 7.19-.62 9-3.97C18.8 10.54 17.6 8 17 8ZM7 20h2c0-.93.19-1.83.5-2.7-.59.2-1.17.43-1.68.7H7V20ZM18 3c0 1.86-.68 3.57-1.8 4.9C15.1 5.89 13 4 13 4s0 4-2 6c-.76 1.24-2 2-2 2s0-3-2-3-2 3-2 3c0 2.41.96 4.55 2.5 6.06.25-1 .5-2.06.5-3.06 1.23 0 3.28 0 5-3 1-2 3-4 3-6s3-5 3-5Z"/></svg>
            </div>
            <span className="font-display font-bold text-lg italic" style={{color:'var(--cream)'}}>AgroPredict</span>
          </div>
          <div className="relative z-10">
            <h2 className="font-display font-black text-4xl leading-none mb-4" style={{color:'var(--cream)',letterSpacing:'-1.5px'}}>
              Join<br/><em style={{color:'var(--marigold-light)'}}>2,400+</em><br/>Farmers
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{color:'rgba(245,243,237,0.65)'}}>Start predicting crop prices and make smarter selling decisions from day one.</p>
            <ul className="space-y-2.5">
              {['AI-powered price forecasting','Real-time mandi data access','7-day price trend charts','Market insights & alerts'].map(b=>(
                <li key={b} className="flex items-center gap-2.5 text-xs" style={{color:'rgba(245,243,237,0.7)'}}>
                  <span style={{color:'var(--marigold)'}}>✦</span> {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs relative z-10" style={{color:'rgba(245,243,237,0.4)'}}>Free to use · No credit card needed</p>
        </div>

        {/* Right form */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <h2 className="font-display font-black text-3xl mb-1" style={{color:'var(--ink)',letterSpacing:'-0.5px'}}>Create your account</h2>
          <p className="text-sm mb-8" style={{color:'var(--ink-soft)'}}>Get started in under 60 seconds</p>

          {error && (
            <div className="mb-5 p-4 rounded-xl text-sm" style={{background:'rgba(183,71,42,0.08)',color:'var(--terra)',border:'1px solid rgba(183,71,42,0.2)'}}>
              {error}
            </div>
          )}

          {[['Full Name','name','text','Ramesh Kumar','👤'],['Email address','email','email','farmer@email.com','✉'],['Password','password','password','Minimum 8 characters','🔒']].map(([label,name,type,ph,icon])=>(
            <div key={name} className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--ink-soft)'}}>{label}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{opacity:0.4}}>{icon}</span>
                <input type={type} placeholder={ph} value={form[name]}
                  onChange={e=>setForm({...form,[name]:e.target.value})}
                  onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
                  style={{background:'var(--cream)',border:'2px solid transparent',color:'var(--ink)',fontFamily:'DM Sans'}}
                  onFocus={e=>{e.target.style.borderColor='var(--fern)';e.target.style.background='#fff';e.target.style.boxShadow='0 0 0 4px rgba(74,124,89,0.09)'}}
                  onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='var(--cream)';e.target.style.boxShadow='none'}}
                />
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold uppercase tracking-wide transition-all duration-200 mt-2"
            style={{background:'var(--fern)',color:'var(--cream)',boxShadow:'0 8px 30px rgba(74,124,89,0.28)',fontFamily:'DM Sans'}}
            onMouseEnter={e=>{if(!loading){e.currentTarget.style.background='var(--fern-dark)';e.currentTarget.style.transform='translateY(-1px)'}}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--fern)';e.currentTarget.style.transform='translateY(0)'}}>
            {loading ? <span className="w-5 h-5 border-2 rounded-full animate-spin" style={{borderColor:'rgba(245,243,237,0.3)',borderTopColor:'var(--cream)'}}/> : <>Create Account <span>→</span></>}
          </button>

          <p className="text-sm text-center mt-6" style={{color:'var(--ink-soft)'}}>
            Already have an account? <Link to="/login" className="font-semibold" style={{color:'var(--fern)'}}>Sign in</Link>
          </p>
          <p className="text-xs text-center mt-3">
            <Link to="/" className="transition-colors" style={{color:'var(--ink-soft)'}} onMouseEnter={e=>e.target.style.color='var(--fern)'} onMouseLeave={e=>e.target.style.color='var(--ink-soft)'}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
