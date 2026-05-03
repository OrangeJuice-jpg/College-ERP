import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{background:'#2c3e50',color:'#fff',width:'200px',minHeight:'100vh',padding:'20px',boxSizing:'border-box'}}>
      <h3 style={{color:'#fff',borderBottom:'1px solid #445',paddingBottom:'10px'}}>Menu</h3>
      <ul style={{listStyle:'none',padding:0}}>
        <li style={{margin:'12px 0'}}><Link to='/' style={{color:'#ccc'}}>Dashboard</Link></li>
        <li style={{margin:'12px 0'}}><Link to='/students' style={{color:'#ccc'}}>Students</Link></li>
        <li style={{margin:'12px 0'}}><Link to='/attendance' style={{color:'#ccc'}}>Attendance</Link></li>
        <li style={{margin:'12px 0'}}><Link to='/faculty' style={{color:'#ccc'}}>Faculty</Link></li>
        <li style={{margin:'12px 0'}}><Link to='/finance' style={{color:'#ccc'}}>Finance</Link></li>
      </ul>
    </div>
  );
}
export default Sidebar;
