import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowDownCircle, ArrowUpCircle, LogOut, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar({ setToken }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    setLoggingOut(true);
    toast.success('👋 Logged out successfully!');
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setLoggingOut(false);
      navigate('/');
    }, 1500);
  };

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { path: '/products', label: 'Products', icon: <Package size={16} /> },
    { path: '/receipts', label: 'Receipts', icon: <ArrowDownCircle size={16} /> },
    { path: '/deliveries', label: 'Deliveries', icon: <ArrowUpCircle size={16} /> },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} theme="dark" />

      {/* Logout Loader */}
      {loggingOut && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            width: '50px', height: '50px',
            border: '4px solid #1e293b',
            borderTop: '4px solid #38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#94a3b8', marginTop: '16px', fontSize: '16px' }}>Logging out...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <nav style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ color: '#38bdf8', fontWeight: 800, fontSize: '20px' }}>CoreInventory</h1>

        <div style={{ display: 'flex', gap: '8px' }}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 500,
                background: location.pathname === link.path ? '#3b82f6' : 'transparent',
                color: location.pathname === link.path ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
            <User size={16} />
            <span>{user.name}</span>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: '#ef4444', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;