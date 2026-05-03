import React from 'react';
function Dashboard() {
  const cards = [{label:'Students',color:'#007bff'},{label:'Faculty',color:'#28a745'},{label:'Finance',color:'#ffc107'},{label:'Inventory',color:'#dc3545'}];
  return (
    <div style={{padding:'20px',flex:1}}>
      <h1>Dashboard</h1>
      <p>Welcome to Vaish College of Engineering ERP System.</p>
      <div style={{display:'flex',gap:'20px',flexWrap:'wrap',marginTop:'20px'}}>
        {cards.map(c => (
          <div key={c.label} style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba(0,0,0,0.1)',flex:'1',minWidth:'150px'}}>
            <h3>{c.label}</h3>
            <p style={{fontSize:'2em',margin:0,color:c.color}}>--</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
