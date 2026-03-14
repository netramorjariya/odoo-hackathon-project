import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Search, AlertTriangle } from 'lucide-react';
import API from '../api/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', sku: '', category: '', unit: '', stock: 0, minStock: 10
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
      setFiltered(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/products/${editId}`, form);
      else await API.post('/products', form);
      setForm({ name: '', sku: '', category: '', unit: '', stock: 0, minStock: 10 });
      setShowForm(false);
      setEditId(null);
      fetchProducts();
    } catch (err) { alert(err.response?.data?.msg || 'Error!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm(p);
    setEditId(p._id);
    setShowForm(true);
  };

  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  const fields = [
    { key: 'name', placeholder: 'Product Name  (e.g. Steel Rods)', type: 'text' },
    { key: 'sku', placeholder: 'SKU / Code  (e.g. STL-001)', type: 'text' },
    { key: 'category', placeholder: 'Category  (e.g. Raw Material)', type: 'text' },
    { key: 'unit', placeholder: 'Unit  (e.g. pcs / kg / ltr)', type: 'text' },
    { key: 'stock', placeholder: 'Initial Stock  (e.g. 100)', type: 'number' },
    { key: 'minStock', placeholder: 'Min Stock Alert Level  (e.g. 20)', type: 'number' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Products</h2>
            <p style={{ color: '#64748b' }}>Manage your inventory</p>
          </div>
          <button onClick={() => { setForm({ name: '', sku: '', category: '', unit: '', stock: 0, minStock: 10 }); setEditId(null); setShowForm(true); }} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600
          }}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '14px 20px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px' }}>
                ⚠️ Low Stock Alert! {lowStockItems.length} item(s) need attention
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                {lowStockItems.map(p => `${p.name} (${p.stock} left)`).join(' • ')}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={16} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: '#64748b'
          }} />
          <input
            type="text"
            placeholder="Search by name, SKU or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 40px',
              borderRadius: '10px', background: '#1e293b',
              border: '1px solid #334155', color: '#fff',
              fontSize: '14px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Modal */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
          }}>
            <div style={{
              background: '#1e293b', borderRadius: '20px', padding: '32px',
              width: '100%', maxWidth: '460px', border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                  {editId ? 'Edit Product' : 'Add Product'}
                </h3>
                <button onClick={() => { setShowForm(false); setEditId(null); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
                }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fields.map(field => (
                  <div key={field.key}>
                    <label style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                      {field.placeholder.split('(')[0].trim()}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '10px',
                        background: '#0f172a', border: '1px solid #334155',
                        color: '#fff', fontSize: '14px', outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                ))}
                <button type="submit" style={{
                  padding: '12px', background: '#3b82f6', color: '#fff',
                  border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: 700, marginTop: '8px', fontSize: '15px'
                }}>
                  {editId ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '80px' }}>Loading...</div>
        ) : (
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Name', 'SKU', 'Category', 'Stock', 'Unit', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: 'left',
                      color: '#64748b', fontSize: '13px', fontWeight: 600
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{p.sku}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{p.category}</td>
                    <td style={{ padding: '14px 16px', color: '#fff', fontWeight: 700 }}>{p.stock}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{p.unit}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        background: p.stock <= p.minStock ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                        color: p.stock <= p.minStock ? '#ef4444' : '#10b981'
                      }}>
                        {p.stock <= p.minStock ? '⚠️ Low Stock' : '✅ In Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(p)} style={{
                          padding: '6px 10px', background: 'rgba(59,130,246,0.2)',
                          color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer'
                        }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} style={{
                          padding: '6px 10px', background: 'rgba(239,68,68,0.2)',
                          color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer'
                        }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                      {search ? 'No products found!' : 'No products yet!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;