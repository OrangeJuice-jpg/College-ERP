import React, { useState } from 'react';

function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', course: '', year: '' });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    setStudents([...students, { ...form, id: Date.now() }]);
    setForm({ name: '', email: '', course: '', year: '' });
  };

  const thStyle = { padding: '12px', textAlign: 'left' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      <h1>Students Management</h1>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>Add Student</h3>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ margin: '5px', padding: '8px', width: '180px' }} />
        <input placeholder="Course" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} style={{ margin: '5px', padding: '8px', width: '140px' }} />
        <input placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={{ margin: '5px', padding: '8px', width: '70px' }} />
        <button onClick={handleAdd} style={{ margin: '5px', padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
      </div>
      <table style={tableStyle}>
        <thead style={{ background: '#35424a', color: '#fff' }}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Course</th>
            <th style={thStyle}>Year</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0
            ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No students yet</td></tr>
            : students.map(s => (
              <tr key={s.id}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.email}</td>
                <td style={tdStyle}>{s.course}</td>
                <td style={tdStyle}>{s.year}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
