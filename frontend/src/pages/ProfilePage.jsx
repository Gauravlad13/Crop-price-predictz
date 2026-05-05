import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: '',
    location: '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2500); };

  return (
    <main className="p-10 animate-fade-in max-w-3xl">
      <div className="bg-white rounded-4xl border overflow-hidden" style={{boxShadow:'0 4px 24px rgba(26,35,24,0.07)',borderColor:'rgba(74,124,89,0.07)'}}>
        {/* Hero */}
        <div className="h-40 relative flex items-end px-10" style={{background:'linear-gradient(135deg,var(--fern-dark),var(--fern))'}}>
          <div className="absolute bottom-0 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white flex items-center justify-center font-display font-bold text-3xl"
            style={{background:'var(--marigold)',color:'var(--ink)'}}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        <div className="pt-14 px-10 pb-10">
          <h2 className="font-display font-black text-3xl" style={{color:'var(--ink)',letterSpacing:'-0.5px'}}>{user?.name}</h2>
          <p className="text-sm mt-1" style={{color:'var(--ink-soft)'}}>{user?.email}</p>
          {user?.created_at && (
            <p className="text-xs mt-0.5" style={{color:'var(--ink-soft)'}}>
              Member since {new Date(user.created_at).toLocaleDateString(undefined,{year:'numeric',month:'long'})}
            </p>
          )}

          <div className="grid grid-cols-2 gap-5 mt-8">
            {[['Full Name','name','text'],['Email','email','email'],['Phone','phone','tel'],['Location','location','text']].map(([label,key,type])=>(
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{color:'var(--ink-soft)'}}>{label}</label>
                <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
                  style={{background:'var(--cream)',border:'2px solid transparent',color:'var(--ink)',fontFamily:'DM Sans'}}
                  onFocus={e=>{e.target.style.borderColor='var(--fern)';e.target.style.background='#fff'}}
                  onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='var(--cream)'}}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button onClick={handleSave}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide transition-all duration-200"
              style={{background: saved ? 'var(--fern-dark)' : 'var(--fern)', color:'var(--cream)', boxShadow:'0 8px 24px rgba(74,124,89,0.28)', fontFamily:'DM Sans'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--fern-dark)'}
              onMouseLeave={e=>e.currentTarget.style.background=saved?'var(--fern-dark)':'var(--fern)'}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
            <button className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide border-2 transition-all duration-200"
              style={{color:'var(--ink)',borderColor:'rgba(26,35,24,0.15)',fontFamily:'DM Sans'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--fern)';e.currentTarget.style.color='var(--fern)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(26,35,24,0.15)';e.currentTarget.style.color='var(--ink)'}}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
