import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? '/auth/login' : '/auth/signup';
      const { data } = await API.post(url, form);

      if (!isLogin) {
        toast.success('✅ Account Created! Please login now.');
        setTimeout(() => {
          setLoading(false);
          setIsLogin(true);
          setForm({ name: '', email: '', password: '', role: 'staff' });
        }, 1500);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('✅ Login Successful!');
        setTimeout(() => {
          setToken(data.token);
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong!');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '15px', marginBottom: '12px',
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <ToastContainer position="top-right" autoClose={1500} theme="dark" />

      {/* Loader */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            width: '50px', height: '50px',
            border: '4px solid #1e293b', borderTop: '4px solid #38bdf8',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#94a3b8', marginTop: '16px', fontSize: '16px' }}>
            {isLogin ? 'Logging in...' : 'Creating account...'}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
        borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px',
        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ color: '#38bdf8', fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
          CoreInventory
        </h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '32px' }}>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          {/* Password with show/hide */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '14px 48px 14px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: '#64748b',
                display: 'flex', alignItems: 'center'
              }}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}

            </button>
          </div>

          {!isLogin && (
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px',
                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '15px', marginBottom: '12px',
                outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#334155' : '#3b82f6',
              color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px', transition: 'all 0.2s'
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '24px', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none', border: 'none', color: '#38bdf8',
              cursor: 'pointer', fontWeight: 700, fontSize: '14px'
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;