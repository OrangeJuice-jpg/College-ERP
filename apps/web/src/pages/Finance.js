import React, { useState } from 'react';

function Finance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ studentName: '', amount: '', description: '' });

  const handleAdd = () => {
    if (!form.studentName || !form.amount) return;
    setRecords([...records, { ...form, id: Date.now(), date: new Date().toLocaleDateString() }]);
    setForm({ studentName: '', amount: '', description: '' });
  };

  const total = records.reduce((sum, r) => sum + Number(r.amount), 0);
  const thStyle = { padding: '12px', textAlign: 'left' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      <h1>Finance Management</h1>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>Add Record</h3>
        <input placeholder="Student Name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={{ margin: '5px', padding: '8px', width: '120px' }} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <button onClick={handleAdd} style={{ margin: '5px', padding: '8px 16px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
      </div>
      <div style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <strong>Total Collected: Rs. {total.toLocaleString()}</strong>
      </div>
      <table style={tableStyle}>
        <thead style={{ background: '#35424a', color: '#fff' }}>
          <tr>
            <th style={thStyle}>Student</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0
            ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No records yet</td></tr>
            : records.map(r => (
              <tr key={r.id}>
                <td style={tdStyle}>{r.studentName}</td>
                <td style={tdStyle}>Rs. {Number(r.amount).toLocaleString()}</td>
                <td style={tdStyle}>{r.description}</td>
                <td style={tdStyle}>{r.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Finance;
