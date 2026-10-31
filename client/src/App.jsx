import { useState } from 'react';
import axios from 'axios';
import Events from './Events';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin ? { email, password } : { name, email, password, role: 'user' };
      
      const res = await axios.post(`${API}${endpoint}`, payload);
      
      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setMsg('Logged in successfully!');
      } else {
        setMsg('Signup successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setMsg('Logged out');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TechFest 2026 Portal</h1>
      
      {!token ? (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Join TechFest'}</h2>
          {msg && <p style={{ color: msg.includes('successfully') ? '#b3ffb3' : '#ffb3b3', textAlign: 'center' }}>{msg}</p>}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!isLogin && (
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
            <button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
          <button
            style={{ marginTop: '15px', background: 'none', border: 'none', color: '#a8c0ff', cursor: 'pointer', width: '100%' }}
            onClick={() => { setIsLogin(!isLogin); setMsg(''); }}
            disabled={loading}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          {msg && <span style={{ marginLeft: '10px', color: '#b3ffb3' }}>{msg}</span>}
        </div>
      )}

      <hr />
      <Events token={token} />
    </div>
  );
}

export default App;
