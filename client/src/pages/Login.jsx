// import React, { useState } from 'react';
// import { api } from '../api';

// export default function Login({ onLogin }) {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const submit = async (e) => {
//         e.preventDefault(); setLoading(true); setError('');
//         try {
//             const { token } = await api.login(username, password);
//             onLogin(token);
//         } catch (e) { setError(e.message); } finally { setLoading(false); }
//     };

//     return (
//         <div className="min-h-screen grid place-items-center bg-slate-900">
//             <form onSubmit={submit} className="bg-white w-[340px] rounded-2xl p-6 grid gap-3 shadow">
//                 <h2 className="text-xl font-semibold">Client Sign In</h2>
//                 <label className="grid gap-1 text-sm">
//                     <span>Username</span>
//                     <input className="px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
//                         value={username} onChange={e => setUsername(e.target.value)} required />
//                 </label>
//                 <label className="grid gap-1 text-sm">
//                     <span>Password</span>
//                     <input type="password" className="px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
//                         value={password} onChange={e => setPassword(e.target.value)} required />
//                 </label>
//                 {error && <div className="text-red-600 text-xs">{error}</div>}
//                 <button disabled={loading} className="mt-2 rounded-xl bg-slate-900 text-white py-2 disabled:opacity-60">
//                     {loading ? 'Signing in…' : 'Sign In'}
//                 </button>
//             </form>
//         </div>
//     );
// }



import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const { token } = await api.login(username, password);
            onLogin(token);
        } catch (e) { setError(e.message); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-slate-900 p-4 sm:p-6">
            <form onSubmit={submit} className="bg-white w-full max-w-[340px] sm:w-[340px] rounded-2xl p-6 sm:p-6 grid gap-4 shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">Client Sign In</h2>
                
                <label className="grid gap-2 text-sm sm:text-base">
                    <span>Username</span>
                    <input 
                        className="px-4 py-3 sm:py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 w-full text-base"
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </label>
                
                <label className="grid gap-2 text-sm sm:text-base">
                    <span>Password</span>
                    <input 
                        type="password" 
                        className="px-4 py-3 sm:py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 w-full text-base"
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </label>
                
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}
                
                <button 
                    disabled={loading} 
                    className="mt-2 rounded-xl bg-slate-900 text-white py-3 sm:py-2 disabled:opacity-60 hover:bg-slate-800 transition-colors text-base font-medium"
                >
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}