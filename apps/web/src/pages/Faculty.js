import React, { useState } from 'react';

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '' });

  const handleAdd = () => {
    if (!form.name) return;
    setFaculty([...faculty, { ...form, id: Date.now() }]);
    setForm({ name: '', email: '', department: '' });
  };

  const thStyle = { padding: '12px', textAlign: 'left' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      <h1>Faculty Management</h1>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>Add Faculty</h3>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <button onClick={handleAdd} style={{ margin: '5px', padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
      </div>
      <table style={tableStyle}>
        <thead style={{ background: '#35424a', color: '#fff' }}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Department</th>
          </tr>
        </thead>
        <tbody>
          {faculty.length === 0
            ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No faculty yet</td></tr>
            : faculty.map(f => (
              <tr key={f.id}>
                <td style={tdStyle}>{f.name}</td>
                <td style={tdStyle}>{f.email}</td>
                <td style={tdStyle}>{f.department}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Faculty;
