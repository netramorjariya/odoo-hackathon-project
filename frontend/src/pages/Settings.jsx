import { useState } from 'react';
import { Settings as SettingsIcon, Plus, Trash2 } from 'lucide-react';

function Settings() {
  const [warehouses, setWarehouses] = useState([
    'Main Warehouse', 'Production Floor', 'Rack A', 'Rack B', 'Warehouse 2'
  ]);
  const [newWarehouse, setNewWarehouse] = useState('');

  const addWarehouse = () => {
    if (newWarehouse.trim()) {
      setWarehouses([...warehouses, newWarehouse.trim()]);
      setNewWarehouse('');
    }
  };

  const removeWarehouse = (i) => {
    setWarehouses(warehouses.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Settings</h2>
          <p style={{ color: '#64748b' }}>Manage warehouses and configuration</p>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingsIcon size={18} color="#3b82f6" /> Warehouses
          </h3>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="New warehouse name"
              value={newWarehouse}
              onChange={e => setNewWarehouse(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addWarehouse()}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '8px',
                background: '#0f172a', border: '1px solid #334155',
                color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
            <button onClick={addWarehouse} style={{
              padding: '10px 16px', background: '#3b82f6', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
              <Plus size={16} />
            </button>
          </div>

          {warehouses.map((w, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: '#0f172a', borderRadius: '8px',
              marginBottom: '8px', border: '1px solid #334155'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>{w}</span>
              <button onClick={() => removeWarehouse(i)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'
              }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;