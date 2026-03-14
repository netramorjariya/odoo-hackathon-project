import { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, ClipboardList } from 'lucide-react';
import API from '../api/axios';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/history');
        setHistory(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const getIcon = (type) => {
    if (type === 'receipt') return <ArrowDownCircle size={16} color="#10b981" />;
    if (type === 'delivery') return <ArrowUpCircle size={16} color="#ef4444" />;
    if (type === 'transfer') return <ArrowLeftRight size={16} color="#3b82f6" />;
    return <ClipboardList size={16} color="#f59e0b" />;
  };

  const getColor = (type) => {
    if (type === 'receipt') return '#10b981';
    if (type === 'delivery') return '#ef4444';
    if (type === 'transfer') return '#3b82f6';
    return '#f59e0b';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Move History</h2>
          <p style={{ color: '#64748b' }}>Complete stock movement ledger</p>
        </div>

        {loading ? <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '80px' }}>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h, i) => (
              <div key={i} style={{ background: '#1e293b', borderRadius: '12px', padding: '16px 20px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: getColor(h.type) + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getIcon(h.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{h.description}</p>
                    <span style={{ color: h.quantity >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '14px' }}>
                      {h.quantity >= 0 ? '+' : ''}{h.quantity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: getColor(h.type) + '20', color: getColor(h.type), textTransform: 'capitalize' }}>{h.type}</span>
                    <p style={{ color: '#475569', fontSize: '12px' }}>{new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: '80px 0' }}>No history yet!</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;