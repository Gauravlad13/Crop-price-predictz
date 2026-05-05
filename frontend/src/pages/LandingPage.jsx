import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const LogoIcon = () => (
  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'var(--fern)'}}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" style={{fill:'var(--cream)'}}>
      <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C7.77 19 9 17 9 16c3.35 0 7.19-.62 9-3.97C18.8 10.54 17.6 8 17 8ZM7 20h2c0-.93.19-1.83.5-2.7-.59.2-1.17.43-1.68.7H7V20ZM18 3c0 1.86-.68 3.57-1.8 4.9C15.1 5.89 13 4 13 4s0 4-2 6c-.76 1.24-2 2-2 2s0-3-2-3-2 3-2 3c0 2.41.96 4.55 2.5 6.06.25-1 .5-2.06.5-3.06 1.23 0 3.28 0 5-3 1-2 3-4 3-6s3-5 3-5Z"/>
    </svg>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  useReveal();

  useEffect(() => {
    const nav = document.getElementById('lp-nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{background:'var(--cream)'}}>
      {/* NAV */}
      <nav id="lp-nav" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 transition-all duration-300"
        style={{background:'rgba(245,243,237,0.88)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(74,124,89,0.1)'}}>
        <div className="flex items-center gap-3">
          <LogoIcon />
          <span className="font-display font-bold text-xl" style={{color:'var(--ink)'}}>
            Agro<em style={{color:'var(--fern)'}}>Predict</em>
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
            style={{color:'var(--ink-soft)'}} onMouseEnter={e=>e.target.style.color='var(--fern)'} onMouseLeave={e=>e.target.style.color='var(--ink-soft)'}>
            Features
          </a>
          <a href="#how" className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
            style={{color:'var(--ink-soft)'}} onMouseEnter={e=>e.target.style.color='var(--fern)'} onMouseLeave={e=>e.target.style.color='var(--ink-soft)'}>
            How It Works
          </a>
          <button onClick={()=>navigate('/login')}
            className="text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-200"
            style={{background:'var(--fern)',color:'var(--cream)',boxShadow:'0 4px 16px rgba(74,124,89,0.3)'}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--fern-dark)';e.currentTarget.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--fern)';e.currentTarget.style.transform='translateY(0)'}}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-16 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background:'radial-gradient(ellipse 70% 60% at 65% 40%, rgba(74,124,89,0.07) 0%,transparent 60%), radial-gradient(circle at 8% 80%, rgba(249,166,32,0.05) 0%,transparent 40%)'
        }}/>
        {/* Big leaf SVG bg */}
        <svg className="absolute pointer-events-none" style={{right:'-60px',top:'80px',width:'440px',opacity:0.04}}
          viewBox="0 0 200 200"><path fill="#4a7c59" d="M100 10C60 30 10 60 10 100c0 50 50 80 90 90 40-10 90-40 90-90 0-40-50-70-90-90Z"/>
          <path fill="none" stroke="#4a7c59" strokeWidth="1.5" d="M100 10v180M60 40c20 40 30 90 30 130M140 40c-20 40-30 90-30 130"/>
        </svg>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7 text-xs font-semibold uppercase tracking-wider"
              style={{background:'rgba(74,124,89,0.1)',border:'1px solid rgba(74,124,89,0.2)',color:'var(--fern)'}}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{background:'var(--marigold)'}}></span>
              AI-Powered · Live Mandi Data
            </div>
            <h1 className="font-display font-black leading-none mb-5"
              style={{fontSize:'clamp(48px,5vw,72px)',color:'var(--ink)',letterSpacing:'-2.5px'}}>
              Predict Crop<br/>
              <em style={{color:'var(--fern)'}}>Market Prices</em><br/>
              <span style={{color:'var(--marigold)'}}>with AI</span>
            </h1>
            <p className="text-base leading-relaxed mb-8 max-w-md" style={{color:'var(--ink-soft)'}}>
              From seeds to statistics — know exactly when to sell your harvest. AgroPredict combines real mandi data with climate intelligence to maximize farm income.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={()=>navigate('/register')}
                className="flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200"
                style={{background:'var(--fern)',color:'var(--cream)',boxShadow:'0 20px 60px rgba(74,124,89,0.22)'}}
                onMouseEnter={e=>{e.currentTarget.style.background='var(--fern-dark)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='var(--fern)';e.currentTarget.style.transform='translateY(0)'}}>
                Start Predicting
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a href="#features"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide border-2 transition-all duration-200"
                style={{color:'var(--ink)',borderColor:'rgba(26,35,24,0.15)'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--fern)';e.currentTarget.style.color='var(--fern)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(26,35,24,0.15)';e.currentTarget.style.color='var(--ink)'}}>
                See Features
              </a>
            </div>
          </div>

          {/* Right - Hero Card */}
          <div className="relative" style={{animation:'heroFloat 0.9s 0.2s ease both'}}>
            <style>{`@keyframes heroFloat{from{opacity:0;transform:perspective(800px) rotateY(15deg) translateX(40px)}to{opacity:1;transform:perspective(800px) rotateY(0deg) translateX(0)}}`}</style>
            {/* Float badge top */}
            <div className="absolute -top-5 -right-5 z-10 flex items-center gap-2.5 px-4 py-3 rounded-2xl animate-float"
              style={{background:'#fff',boxShadow:'0 16px 50px rgba(26,35,24,0.12)',border:'1px solid rgba(74,124,89,0.08)'}}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:'rgba(74,124,89,0.1)'}}>📈</div>
              <div>
                <p className="text-xs" style={{color:'var(--ink-soft)'}}>Tomato · Mumbai</p>
                <p className="text-sm font-bold" style={{color:'var(--fern)'}}>+₹200/qtl this week</p>
              </div>
            </div>
            {/* Main card */}
            <div className="bg-white rounded-4xl p-8 relative overflow-hidden"
              style={{boxShadow:'0 40px 100px rgba(26,35,24,0.14)',border:'1px solid rgba(74,124,89,0.08)'}}>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-4xl"
                style={{background:'linear-gradient(90deg,var(--fern),var(--marigold),var(--terra))'}}/>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg" style={{color:'var(--ink)'}}>Price Forecast</h3>
                  <p className="text-xs mt-1" style={{color:'var(--ink-soft)'}}>Tomato · Pune Mandi</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide" style={{background:'rgba(74,124,89,0.1)',color:'var(--fern)'}}>Live</span>
              </div>
              <div className="font-display font-black" style={{fontSize:'48px',color:'var(--ink)',letterSpacing:'-2px',lineHeight:1}}>
                ₹2,840 <span className="text-base font-medium" style={{color:'var(--ink-soft)'}}>/ qtl</span>
              </div>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{background:'rgba(74,124,89,0.1)',color:'var(--fern)'}}>
                ↑ +12.4% · Rising trend
              </div>
              {/* Sparkline */}
              <div className="mt-6 h-20">
                <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#4a7c59" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30 L180,35 L210,20 L240,25 L270,10 L300,8 L300,80 L0,80Z" fill="url(#hg)"/>
                  <path d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30 L180,35 L210,20 L240,25 L270,10 L300,8" fill="none" stroke="#4a7c59" strokeWidth="2.5"/>
                  <path d="M210,20 L240,13 L270,6 L300,2" fill="none" stroke="#f9a620" strokeWidth="2" strokeDasharray="6,4"/>
                  <circle cx="210" cy="20" r="4" fill="#4a7c59"/>
                  <circle cx="300" cy="2" r="4" fill="#f9a620"/>
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[['91%','Confidence'],['₹2,240','Last Price'],['7d','Forecast']].map(([v,l])=>(
                  <div key={l} className="rounded-2xl p-3 text-center" style={{background:'var(--cream)'}}>
                    <div className="font-display font-bold text-lg" style={{color:'var(--ink)',letterSpacing:'-0.5px'}}>{v}</div>
                    <div className="text-xs mt-0.5" style={{color:'var(--ink-soft)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Float badge bottom */}
            <div className="absolute -bottom-4 -left-8 z-10 flex items-center gap-2.5 px-4 py-3 rounded-2xl animate-float" style={{animationDelay:'1.5s',background:'#fff',boxShadow:'0 16px 50px rgba(26,35,24,0.12)',border:'1px solid rgba(74,124,89,0.08)'}}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:'rgba(183,71,42,0.1)'}}>🌾</div>
              <div>
                <p className="text-xs" style={{color:'var(--ink-soft)'}}>2,400+ farmers</p>
                <p className="text-sm font-bold" style={{color:'var(--terra)'}}>Sell at peak price</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div id="features" style={{background:'var(--ink)',padding:'100px 0'}}>
        <div className="max-w-6xl mx-auto px-16">
          <div className="grid grid-cols-2 gap-16 items-end mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-0.5" style={{background:'var(--marigold)',display:'inline-block'}}></span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--marigold)'}}>What We Offer</span>
              </div>
              <h2 className="reveal font-display font-black leading-none" style={{fontSize:'clamp(36px,4vw,52px)',color:'var(--cream)',letterSpacing:'-1.5px'}}>
                Built for the<br/><em style={{color:'var(--fern-light)'}}>Modern Farmer</em>
              </h2>
            </div>
            <p className="reveal stagger-1 text-base leading-relaxed" style={{color:'rgba(245,243,237,0.5)'}}>
              Advanced AI algorithms trained on decades of mandi data, weather patterns and market trends — delivered in a simple interface.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {[
              { icon:'📊', title:'Price Prediction', desc:'ML models forecast your crop prices using historical mandi data and seasonal patterns.' },
              { icon:'🗺️', title:'Market Insights', desc:'Understand price movements across markets and identify the best selling location.' },
              { icon:'🌦️', title:'Climate Factors', desc:'Weather data directly influences supply and demand — factored into every forecast.' },
              { icon:'💡', title:'Smart Alerts', desc:'Get notified when prices peak so you can time your sales for maximum returns.' },
            ].map((f,i)=>(
              <div key={f.title} className={`reveal stagger-${i+1} rounded-3xl p-8 border cursor-default transition-all duration-400`}
                style={{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.07)'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(74,124,89,0.15)';e.currentTarget.style.borderColor='rgba(74,124,89,0.35)';e.currentTarget.style.transform='perspective(700px) rotateX(-4deg) translateY(-8px)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.transform='none';}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300"
                  style={{background:'rgba(74,124,89,0.2)'}}>{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-3" style={{color:'var(--cream)',letterSpacing:'-0.3px'}}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(245,243,237,0.5)'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:'linear-gradient(135deg,var(--fern-dark),var(--fern))',padding:'70px 0'}}>
        <div className="max-w-6xl mx-auto px-16 grid grid-cols-4 gap-10 text-center">
          {[['2,400+','Farmers Served'],['94%','Forecast Accuracy'],['50+','Crop Varieties'],['₹18Cr','Revenue Unlocked']].map(([v,l])=>(
            <div key={l} className="reveal">
              <div className="font-display font-black" style={{fontSize:'52px',color:'var(--cream)',letterSpacing:'-2px'}}>{v}</div>
              <div className="text-xs font-medium uppercase tracking-widest mt-2" style={{color:'rgba(245,243,237,0.55)'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{background:'var(--cream-dark)',padding:'100px 0'}}>
        <div className="max-w-6xl mx-auto px-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-7 h-0.5" style={{background:'var(--marigold)',display:'inline-block'}}></span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--fern)'}}>Simple Process</span>
              <span className="w-7 h-0.5" style={{background:'var(--marigold)',display:'inline-block'}}></span>
            </div>
            <h2 className="reveal font-display font-black" style={{fontSize:'clamp(36px,4vw,52px)',color:'var(--ink)',letterSpacing:'-1.5px'}}>
              How to Use <em style={{color:'var(--fern)'}}>AgroPredict</em>
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-8 relative">
            <div className="absolute top-8 left-[12%] right-[12%] h-px opacity-20" style={{background:'linear-gradient(90deg,transparent,var(--fern),var(--marigold),var(--fern),transparent)'}}/>
            {[['01','Create Account','Sign up in seconds — just your name and email to get started.'],
              ['02','Select Crop & Market','Choose your crop type and nearest mandi market.'],
              ['03','View Forecast','See a 7-day price prediction with AI confidence scores.'],
              ['04','Sell at Peak','Wait for the optimal price window and sell for maximum returns.']
            ].map(([n,title,desc],i)=>(
              <div key={n} className={`reveal stagger-${i+1} text-center p-8 rounded-3xl transition-all duration-400`}
                onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.boxShadow='0 20px 50px rgba(26,35,24,0.10)';e.currentTarget.style.transform='perspective(600px) rotateX(-5deg) translateY(-6px)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 font-display font-black text-2xl border-2 transition-all duration-300"
                  style={{background:'var(--cream)',borderColor:'rgba(74,124,89,0.15)',color:'var(--fern)',letterSpacing:'-1px'}}>
                  {n}
                </div>
                <h4 className="font-display font-bold text-lg mb-3" style={{color:'var(--ink)'}}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{color:'var(--ink-soft)'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'var(--ink)',padding:'80px 0 40px'}}>
        <div className="max-w-6xl mx-auto px-16">
          <div className="grid grid-cols-3 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LogoIcon />
                <span className="font-display font-bold text-xl italic" style={{color:'var(--cream)'}}>AgroPredict</span>
              </div>
              <p className="text-sm leading-relaxed" style={{color:'rgba(245,243,237,0.45)'}}>
                Empowering Indian farmers with AI-driven crop price intelligence. From field to market — we've got you covered.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{color:'var(--cream)'}}>Platform</h4>
              {['Dashboard','Price Predictions','Market History'].map(l=>(
                <a key={l} onClick={()=>navigate('/login')} className="block text-sm mb-3 cursor-pointer transition-colors duration-200"
                  style={{color:'rgba(245,243,237,0.45)'}} onMouseEnter={e=>e.target.style.color='var(--marigold)'} onMouseLeave={e=>e.target.style.color='rgba(245,243,237,0.45)'}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{color:'var(--cream)'}}>Account</h4>
              {[['Login','/login'],['Register','/register']].map(([l,p])=>(
                <a key={l} onClick={()=>navigate(p)} className="block text-sm mb-3 cursor-pointer transition-colors duration-200"
                  style={{color:'rgba(245,243,237,0.45)'}} onMouseEnter={e=>e.target.style.color='var(--marigold)'} onMouseLeave={e=>e.target.style.color='rgba(245,243,237,0.45)'}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center border-t pt-8 text-xs" style={{borderColor:'rgba(255,255,255,0.06)',color:'rgba(245,243,237,0.3)'}}>
            <span>© 2026 AgroPredict · All rights reserved</span>
            <span>Supporting farmers across India 🌱</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
