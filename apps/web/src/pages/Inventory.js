import React, { useState } from 'react';

function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', category: '' });

  const handleAdd = () => {
    if (!form.name) return;
    setItems([...items, { ...form, id: Date.now() }]);
    setForm({ name: '', quantity: '', category: '' });
  };

  const thStyle = { padding: '12px', textAlign: 'left' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      <h1>Inventory Management</h1>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>Add Item</h3>
        <input placeholder="Item Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={{ margin: '5px', padding: '8px', width: '100px' }} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ margin: '5px', padding: '8px', width: '160px' }} />
        <button onClick={handleAdd} style={{ margin: '5px', padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
      </div>
      <table style={tableStyle}>
        <thead style={{ background: '#35424a', color: '#fff' }}>
          <tr>
            <th style={thStyle}>Item</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0
            ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No items yet</td></tr>
            : items.map(i => (
              <tr key={i.id}>
                <td style={tdStyle}>{i.name}</td>
                <td style={tdStyle}>{i.quantity}</td>
                <td style={tdStyle}>{i.category}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
