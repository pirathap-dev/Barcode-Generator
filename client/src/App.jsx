import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Generator from './pages/Generator';
import { api } from './api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser]   = useState(null);

  useEffect(() => {
    if (!token) return;
    api.setToken(token);
    api.me()
      .then(setUser)
      .catch(() => { localStorage.removeItem('token'); setToken(null); });
  }, [token]);

  if (!token) return <Login onLogin={(t)=>{ localStorage.setItem('token', t); setToken(t); }} />;
  if (!user)  return <div className="p-6">Loading…</div>;
  return <Generator user={user} onLogout={()=>{ localStorage.removeItem('token'); setToken(null); }} />;
}
