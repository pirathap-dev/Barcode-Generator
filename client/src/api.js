const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
    _token: null,
    setToken(t) { this._token = t; },

    async login(username, password) {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        this._token = data.token;
        return data;
    },

    async me() {
        const res = await fetch(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${this._token}` }
        });
        if (!res.ok) throw new Error('Auth needed');
        return (await res.json()).user;
    }
};
