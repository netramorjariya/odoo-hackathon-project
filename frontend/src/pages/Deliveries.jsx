import { useEffect, useState } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import API from '../api/axios';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customer: '',
    products: [{ product: '', quantity: 1 }]
  });

  const fetchData = async () => {
    try {
      const [d, p] = await Promise.all([
        API.get('/deliveries'),
        API.get('/products')
      ]);
      setDeliveries(d.data);
      setProducts(p.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addProductRow = () => {
    setForm({ ...form, products: [...form.products, { product: '', quantity: 1 }] });
  };

  const removeProductRow = (i) => {
    const updated = form.products.filter((_, idx) => idx !== i);
    setForm({ ...form, products: updated });
  };

  const updateProductRow = (i, key, value) => {
    const updated = [...form.products];
    updated[i][key] = value;
    setForm({ ...form, products: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/deliveries', form);
      setForm({ customer: '', products: [{ product: '', quantity: 1 }] });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error!');
    }
  };

  const handleValidate = async (id) => {
    try {
      await API.put(`/deliveries/validate/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Deliveries</h2>
            <p className="text-slate-400">Outgoing stock to customers</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105"
          >
            <Plus size={18} /> New Delivery
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-lg border border-slate-600 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">New Delivery</h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={20} className="text-slate-400 hover:text-white" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={form.customer}
                  onChange={e => setForm({ ...form, customer: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {form.products.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      value={row.product}
                      onChange={e => updateProductRow(i, 'product', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={e => updateProductRow(i, 'quantity', e.target.value)}
                      className="w-24 px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {i > 0 && (
                      <button type="button" onClick={() => removeProductRow(i)}>
                        <X size={20} className="text-red-400 hover:text-red-300" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProductRow}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Add Product
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Create Delivery
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Deliveries List */}
        {loading ? (
          <div className="text-white text-center animate-pulse text-xl mt-20">Loading...</div>
        ) : (
          <div className="space-y-4">
            {deliveries.map(d => (
              <div key={d._id} className="bg-slate-700 rounded-2xl p-6 border border-slate-600 hover:border-blue-400 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold text-lg">{d.customer}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {d.products.map(p => `${p.product?.name || 'N/A'} x${p.quantity}`).join(', ')}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {d.status === 'done' ? 'Delivered' : 'Draft'}
                    </span>
                    {d.status !== 'done' && (
                      <button
                        onClick={() => handleValidate(d._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105"
                      >
                        <CheckCircle size={16} /> Validate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {deliveries.length === 0 && (
              <div className="text-center text-slate-400 py-20">No deliveries yet!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deliveries;