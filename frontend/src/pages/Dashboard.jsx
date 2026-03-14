import { useEffect, useState } from 'react';
import { Package, ArrowDownCircle, ArrowUpCircle, AlertTriangle, ArrowLeftRight, ClipboardList, Clock } from 'lucide-react';
import API from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0, lowStock: 0,
    pendingReceipts: 0, pendingDeliveries: 0,
    totalTransfers: 0, totalAdjustments: 0
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user.role === 'manager';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, receipts, deliveries] = await Promise.all([
          API.get('/products'),
          API.get('/receipts'),
          API.get('/deliveries'),
        ]);

        const lowItems = products.data.filter(p => p.stock <= p.minStock);
        setLowStockItems(lowItems);

        let transferCount = 0, adjustmentCount = 0;
        if (isManager) {
          const [transfers, adjustments] = await Promise.all([
            API.get('/transfers'),
            API.get('/adjustments'),
          ]);
          transferCount = transfers.data.length;
          adjustmentCount = adjustments.data.length;
        }

        setStats({
          totalProducts: products.data.length,
          lowStock: lowItems.length,
          pendingReceipts: receipts.data.filter(r => r.status === 'draft').length,
          pendingDeliveries: deliveries.data.filter(d => d.status === 'draft').length,
          totalTransfers: transferCount,
          totalAdjustments: adjustmentCount,
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const managerCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: '#3b82f6' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: <AlertTriangle size={24} />, color: '#ef4444' },
    { label: 'Pending Receipts', value: stats.pendingReceipts, icon: <Clock size={24} />, color: '#f59e0b' },
    { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: <Clock size={24} />, color: '#8b5cf6' },
    { label: 'Internal Transfers', value: stats.totalTransfers, icon: <ArrowLeftRight size={24} />, color: '#10b981' },
    { label: 'Stock Adjustments', value: stats.totalAdjustments, icon: <ClipboardList size={24} />, color: '#06b6d4' },
  ];

  const staffCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: '#3b82f6' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: <AlertTriangle size={24} />, color: '#ef4444' },
    { label: 'Pending Receipts', value: stats.pendingReceipts, icon: <ArrowDownCircle size={24} />, color: '#f59e0b' },
    { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: <ArrowUpCircle size={24} />, color: '#8b5cf6' },
  ];

  const cards = isManager ? managerCards : staffCards;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>
            {isManager ? 'Manager Dashboard' : 'Staff Dashboard'}
          </h2>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Welcome back, <span style={{ color: '#38bdf8' }}>{user.name}</span>!
            <span style={{
              marginLeft: '10px', padding: '2px 10px', borderRadius: '20px', fontSize: '12px',
              background: isManager ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)',
              color: isManager ? '#3b82f6' : '#10b981', fontWeight: 600, textTransform: 'capitalize'
            }}>{user.role}</span>
          </p>
        </div>

        {/* Low Stock Alert Banner */}
        {lowStockItems.length > 0 && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px' }}>
                Low Stock Alert! {lowStockItems.length} item(s) need attention
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                {lowStockItems.map(p => `${p.name} (${p.stock} left)`).join(' • ')}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '80px', fontSize: '18px' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {cards.map((card, i) => (
              <div key={i} style={{
                background: '#1e293b', borderRadius: '16px', padding: '24px',
                border: '1px solid #334155', transition: 'all 0.3s', cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: card.color + '20', color: card.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
                }}>
                  {card.icon}
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>{card.label}</p>
                <p style={{ color: '#fff', fontSize: '32px', fontWeight: 800 }}>{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {!isManager && (
          <div style={{
            marginTop: '32px', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px', padding: '16px 20px'
          }}>
            <p style={{ color: '#ef4444', fontSize: '14px' }}>
              🔒 Transfers, Adjustments and Settings are restricted to Managers only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;