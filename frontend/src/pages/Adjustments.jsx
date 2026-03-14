import { useEffect, useState } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import API from '../api/axios';

function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ product: '', countedQty: 0, reason: '' });

  const fetchData = async () => {
    try {
      const [a, p] = await Promise.all([API.get('/adjustments'), API.get('/products')]);
      setAdjustments(a.data);
      setProducts(p.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/adjustments', form);
      setForm({ product: '', countedQty: 0, reason: '' });
      setShowForm(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Error!'); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    background: '#0f172a', border: '1px solid #334155',
    color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Stock Adjustments</h2>
            <p style={{ color: '#64748b' }}>Fix stock mismatches</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600
          }}>
            <Plus size={18} /> New Adjustment
          </button>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ background: '#1e293b', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>New Adjustment</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} style={inputStyle}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name} (Current: {p.stock})</option>)}
                </select>
                <input type="number" placeholder="Counted Quantity" value={form.countedQty}
                  onChange={e => setForm({ ...form, countedQty: e.target.value })} style={inputStyle} />
                <input type="text" placeholder="Reason (optional)" value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })} style={inputStyle} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Apply Adjustment</button>
              </form>
            </div>
          </div>
        )}

        {loading ? <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '80px' }}>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {adjustments.map(a => (
              <div key={a._id} style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{a.product?.name || 'N/A'}</h3>
                  <p style={{ color: '#64748b', fontSize: '13px' }}>
                    Previous: <span style={{ color: '#f59e0b' }}>{a.previousQty}</span> →
                    Counted: <span style={{ color: '#10b981' }}>{a.countedQty}</span> →
                    Difference: <span style={{ color: a.difference >= 0 ? '#10b981' : '#ef4444' }}>{a.difference >= 0 ? '+' : ''}{a.difference}</span>
                  </p>
                  {a.reason && <p style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>Reason: {a.reason}</p>}
                  <p style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>Done</span>
              </div>
            ))}
            {adjustments.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: '80px 0' }}>No adjustments yet!</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Adjustments;