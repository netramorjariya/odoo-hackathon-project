import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard, Package, ArrowDownCircle, ArrowUpCircle,
  ArrowLeftRight, ClipboardList, Settings, User, LogOut,
  ChevronLeft, ChevronRight, History
} from 'lucide-react';

function Layout({ children, setToken }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user.role === 'manager';

  const logout = () => {
    setLoggingOut(true);
    toast.success('👋 Logged out!');
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setLoggingOut(false);
      navigate('/');
    }, 1500);
  };

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, access: 'all' },
    { path: '/products', label: 'Products', icon: <Package size={18} />, access: 'all' },
    { path: '/receipts', label: 'Receipts', icon: <ArrowDownCircle size={18} />, access: 'all' },
    { path: '/deliveries', label: 'Deliveries', icon: <ArrowUpCircle size={18} />, access: 'all' },
    { path: '/transfers', label: 'Transfers', icon: <ArrowLeftRight size={18} />, access: 'manager' },
    { path: '/adjustments', label: 'Adjustments', icon: <ClipboardList size={18} />, access: 'manager' },
    { path: '/history', label: 'Move History', icon: <History size={18} />, access: 'manager' },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} />, access: 'manager' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      <ToastContainer position="top-right" autoClose={1500} theme="dark" />

      {loggingOut && (
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
          <p style={{ color: '#94a3b8', marginTop: '16px' }}>Logging out...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Sidebar */}
      <div style={{
        width: collapsed ? '70px' : '240px',
        background: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {!collapsed && (
            <h1 style={{ color: '#38bdf8', fontWeight: 800, fontSize: '18px', whiteSpace: 'nowrap' }}>
              CoreInventory
            </h1>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', display: 'flex', alignItems: 'center',
            marginLeft: collapsed ? 'auto' : '0'
          }}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {links
            .filter(link => link.access === 'all' || isManager)
            .map(link => (
              <Link
                key={link.path}
                to={link.path}
                title={collapsed ? link.label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  background: location.pathname === link.path ? '#3b82f6' : 'transparent',
                  color: location.pathname === link.path ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s'
                }}
              >
                {link.icon}
                {!collapsed && link.label}
              </Link>
            ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #334155' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', marginBottom: '4px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: isManager ? '#3b82f6' : '#10b981',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              <User size={16} color="#fff" />
            </div>
            {!collapsed && (
              <div>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{user.name}</p>
                <p style={{
                  fontSize: '11px', textTransform: 'capitalize',
                  color: isManager ? '#3b82f6' : '#10b981'
                }}>
                  {user.role}
                </p>
              </div>
            )}
          </div>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', width: '100%', background: 'none',
            border: 'none', cursor: 'pointer', borderRadius: '8px',
            color: '#ef4444', fontSize: '14px', fontWeight: 500,
            transition: 'all 0.2s'
          }}>
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: collapsed ? '70px' : '240px',
        flex: 1,
        transition: 'margin-left 0.3s',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;