import { useEffect, useState } from 'react';
import { Plus, X, CheckCircle, ArrowLeftRight } from 'lucide-react';
import API from '../api/axios';

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fromWarehouse: '', toWarehouse: '',
    products: [{ product: '', quantity: 1 }]
  });

  const warehouses = ['Main Warehouse', 'Production Floor', 'Rack A', 'Rack B', 'Warehouse 2'];

  const fetchData = async () => {
    try {
      const [t, p] = await Promise.all([API.get('/transfers'), API.get('/products')]);
      setTransfers(t.data);
      setProducts(p.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transfers', form);
      setForm({ fromWarehouse: '', toWarehouse: '', products: [{ product: '', quantity: 1 }] });
      setShowForm(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Error!'); }
  };

  const handleValidate = async (id) => {
    try {
      await API.put(`/transfers/validate/${id}`);
      fetchData();
    } catch (err) { alert(err.response?.data?.msg || 'Error!'); }
  };

  const selectStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    background: '#0f172a', border: '1px solid #334155',
    color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Internal Transfers</h2>
            <p style={{ color: '#64748b' }}>Move stock between warehouses</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600
          }}>
            <Plus size={18} /> New Transfer
          </button>
        </div>

        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
          }}>
            <div style={{
              background: '#1e293b', borderRadius: '20px', padding: '32px',
              width: '100%', maxWidth: '500px', border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>New Transfer</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select value={form.fromWarehouse} onChange={e => setForm({ ...form, fromWarehouse: e.target.value })} style={selectStyle}>
                  <option value="">From Warehouse</option>
                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <select value={form.toWarehouse} onChange={e => setForm({ ...form, toWarehouse: e.target.value })} style={selectStyle}>
                  <option value="">To Warehouse</option>
                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                {form.products.map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <select value={row.product} onChange={e => { const u = [...form.products]; u[i].product = e.target.value; setForm({ ...form, products: u }); }} style={{ ...selectStyle, flex: 1 }}>
                      <option value="">Select Product</option>
                      {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <input type="number" min="1" value={row.quantity}
                      onChange={e => { const u = [...form.products]; u[i].quantity = e.target.value; setForm({ ...form, products: u }); }}
                      style={{ ...selectStyle, width: '80px' }} />
                    {i > 0 && <button type="button" onClick={() => setForm({ ...form, products: form.products.filter((_, idx) => idx !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={18} /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({ ...form, products: [...form.products, { product: '', quantity: 1 }] })} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}>+ Add Product</button>
                <button type="submit" style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Create Transfer</button>
              </form>
            </div>
          </div>
        )}

        {loading ? <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '80px' }}>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transfers.map(t => (
              <div key={t._id} style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>{t.fromWarehouse}</span>
                    <ArrowLeftRight size={14} color="#3b82f6" />
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>{t.toWarehouse}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>{t.products?.map(p => `${p.product?.name || 'N/A'} x${p.quantity}`).join(', ')}</p>
                  <p style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: t.status === 'done' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.status === 'done' ? '#10b981' : '#f59e0b' }}>
                    {t.status === 'done' ? 'Completed' : 'Draft'}
                  </span>
                  {t.status !== 'done' && (
                    <button onClick={() => handleValidate(t._id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <CheckCircle size={14} /> Validate
                    </button>
                  )}
                </div>
              </div>
            ))}
            {transfers.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: '80px 0' }}>No transfers yet!</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transfers;