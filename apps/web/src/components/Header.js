import React from 'react';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header style={{background:'#35424a',color:'#fff',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <h2 style={{margin:0}}>Vaish College of Engineering ERP</h2>
      <nav>
        <Link to='/' style={{color:'#fff',margin:'0 10px'}}>Dashboard</Link>
        <Link to='/students' style={{color:'#fff',margin:'0 10px'}}>Students</Link>
        <Link to='/faculty' style={{color:'#fff',margin:'0 10px'}}>Faculty</Link>
        <Link to='/finance' style={{color:'#fff',margin:'0 10px'}}>Finance</Link>
        <Link to='/inventory' style={{color:'#fff',margin:'0 10px'}}>Inventory</Link>
      </nav>
    </header>
  );
}
export default Header;
