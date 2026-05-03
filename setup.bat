@echo off
echo Setting up Vaish ERP Web App...

mkdir apps\web\src\components 2>nul
mkdir apps\web\src\pages 2>nul
mkdir apps\web\src\styles 2>nul
mkdir apps\web\public 2>nul

:: index.js
(
echo import React from 'react';
echo import ReactDOM from 'react-dom/client';
echo import App from './App';
echo import './styles/index.css';
echo const root = ReactDOM.createRoot^(document.getElementById^('root'^)^);
echo root.render^(^<React.StrictMode^>^<App /^>^</React.StrictMode^>^);
) > apps\web\src\index.js

:: App.js
(
echo import React from 'react';
echo import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
echo import Header from './components/Header';
echo import Sidebar from './components/Sidebar';
echo import Footer from './components/Footer';
echo import Dashboard from './pages/Dashboard';
echo import Students from './pages/Students';
echo import Faculty from './pages/Faculty';
echo import Finance from './pages/Finance';
echo import Inventory from './pages/Inventory';
echo import './styles/index.css';
echo function App^(^) {
echo   return ^(
echo     ^<Router^>
echo       ^<div className='app'^>
echo         ^<Header /^>
echo         ^<div className='main-content'^>
echo           ^<Sidebar /^>
echo           ^<Switch^>
echo             ^<Route path='/' exact component={Dashboard} /^>
echo             ^<Route path='/students' component={Students} /^>
echo             ^<Route path='/faculty' component={Faculty} /^>
echo             ^<Route path='/finance' component={Finance} /^>
echo             ^<Route path='/inventory' component={Inventory} /^>
echo           ^</Switch^>
echo         ^</div^>
echo         ^<Footer /^>
echo       ^</div^>
echo     ^</Router^>
echo   ^);
echo }
echo export default App;
) > apps\web\src\App.js

:: index.html
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo   ^<head^>
echo     ^<meta charset="utf-8" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1" /^>
echo     ^<title^>Vaish College ERP^</title^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo   ^</body^>
echo ^</html^>
) > apps\web\public\index.html

:: index.css
(
echo body { margin:0; font-family:Arial,sans-serif; background:#f4f4f4; }
echo .app { display:flex; flex-direction:column; min-height:100vh; }
echo .main-content { display:flex; flex:1; }
echo a { text-decoration:none; }
) > apps\web\src\styles\index.css

:: Header.js
(
echo import React from 'react';
echo import { Link } from 'react-router-dom';
echo function Header^(^) {
echo   return ^(
echo     ^<header style={{background:'#35424a',color:'#fff',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}^>
echo       ^<h2 style={{margin:0}}^>Vaish College of Engineering ERP^</h2^>
echo       ^<nav^>
echo         ^<Link to='/' style={{color:'#fff',margin:'0 10px'}}^>Dashboard^</Link^>
echo         ^<Link to='/students' style={{color:'#fff',margin:'0 10px'}}^>Students^</Link^>
echo         ^<Link to='/faculty' style={{color:'#fff',margin:'0 10px'}}^>Faculty^</Link^>
echo         ^<Link to='/finance' style={{color:'#fff',margin:'0 10px'}}^>Finance^</Link^>
echo         ^<Link to='/inventory' style={{color:'#fff',margin:'0 10px'}}^>Inventory^</Link^>
echo       ^</nav^>
echo     ^</header^>
echo   ^);
echo }
echo export default Header;
) > apps\web\src\components\Header.js

:: Sidebar.js
(
echo import React from 'react';
echo import { Link } from 'react-router-dom';
echo function Sidebar^(^) {
echo   return ^(
echo     ^<div style={{background:'#2c3e50',color:'#fff',width:'200px',minHeight:'100vh',padding:'20px',boxSizing:'border-box'}}^>
echo       ^<h3 style={{color:'#fff',borderBottom:'1px solid #445',paddingBottom:'10px'}}^>Menu^</h3^>
echo       ^<ul style={{listStyle:'none',padding:0}}^>
echo         ^<li style={{margin:'12px 0'}}^>^<Link to='/' style={{color:'#ccc'}}^>Dashboard^</Link^>^</li^>
echo         ^<li style={{margin:'12px 0'}}^>^<Link to='/students' style={{color:'#ccc'}}^>Students^</Link^>^</li^>
echo         ^<li style={{margin:'12px 0'}}^>^<Link to='/faculty' style={{color:'#ccc'}}^>Faculty^</Link^>^</li^>
echo         ^<li style={{margin:'12px 0'}}^>^<Link to='/finance' style={{color:'#ccc'}}^>Finance^</Link^>^</li^>
echo         ^<li style={{margin:'12px 0'}}^>^<Link to='/inventory' style={{color:'#ccc'}}^>Inventory^</Link^>^</li^>
echo       ^</ul^>
echo     ^</div^>
echo   ^);
echo }
echo export default Sidebar;
) > apps\web\src\components\Sidebar.js

:: Footer.js
(
echo import React from 'react';
echo function Footer^(^) {
echo   return ^(
echo     ^<footer style={{background:'#35424a',color:'#fff',textAlign:'center',padding:'10px'}}^>
echo       ^<p style={{margin:0}}^>^&copy; 2024 Vaish College of Engineering, Rohtak.^</p^>
echo     ^</footer^>
echo   ^);
echo }
echo export default Footer;
) > apps\web\src\components\Footer.js

:: Dashboard.js
(
echo import React from 'react';
echo function Dashboard^(^) {
echo   const cards = [{label:'Students',color:'#007bff'},{label:'Faculty',color:'#28a745'},{label:'Finance',color:'#ffc107'},{label:'Inventory',color:'#dc3545'}];
echo   return ^(
echo     ^<div style={{padding:'20px',flex:1}}^>
echo       ^<h1^>Dashboard^</h1^>
echo       ^<p^>Welcome to Vaish College of Engineering ERP System.^</p^>
echo       ^<div style={{display:'flex',gap:'20px',flexWrap:'wrap',marginTop:'20px'}}^>
echo         {cards.map^(c =^> ^(
echo           ^<div key={c.label} style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',flex:'1',minWidth:'150px'}}^>
echo             ^<h3^>{c.label}^</h3^>
echo             ^<p style={{fontSize:'2em',margin:0,color:c.color}}^>--^</p^>
echo           ^</div^>
echo         ^)^)}
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
echo export default Dashboard;
) > apps\web\src\pages\Dashboard.js

:: Students.js
(
echo import React, { useState } from 'react';
echo function Students^(^) {
echo   const [students, setStudents] = useState^([]^);
echo   const [form, setForm] = useState^({ name:'', email:'', course:'', year:'' }^);
echo   const handleAdd = ^(^) =^> {
echo     if ^(!form.name ^|^| !form.email^) return;
echo     setStudents^([...students, { ...form, id: Date.now^(^) }]^);
echo     setForm^({ name:'', email:'', course:'', year:'' }^);
echo   };
echo   const thStyle = {padding:'12px',textAlign:'left'};
echo   const tdStyle = {padding:'12px',borderBottom:'1px solid #eee'};
echo   return ^(
echo     ^<div style={{padding:'20px',flex:1}}^>
echo       ^<h1^>Students Management^</h1^>
echo       ^<div style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',marginBottom:'20px'}}^>
echo         ^<h3^>Add Student^</h3^>
echo         ^<input placeholder='Name' value={form.name} onChange={e=^>setForm^({...form,name:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Email' value={form.email} onChange={e=^>setForm^({...form,email:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Course' value={form.course} onChange={e=^>setForm^({...form,course:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'140px'}} /^>
echo         ^<input placeholder='Year' value={form.year} onChange={e=^>setForm^({...form,year:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'70px'}} /^>
echo         ^<button onClick={handleAdd} style={{margin:'5px',padding:'8px 16px',background:'#007bff',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}^>Add^</button^>
echo       ^</div^>
echo       ^<table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)'}}^>
echo         ^<thead style={{background:'#35424a',color:'#fff'}}^>^<tr^>^<th style={thStyle}^>Name^</th^>^<th style={thStyle}^>Email^</th^>^<th style={thStyle}^>Course^</th^>^<th style={thStyle}^>Year^</th^>^</tr^>^</thead^>
echo         ^<tbody^>{students.length===0?^<tr^>^<td colSpan='4' style={{textAlign:'center',padding:'20px',color:'#888'}}^>No students yet^</td^>^</tr^>:students.map^(s=^>^<tr key={s.id}^>^<td style={tdStyle}^>{s.name}^</td^>^<td style={tdStyle}^>{s.email}^</td^>^<td style={tdStyle}^>{s.course}^</td^>^<td style={tdStyle}^>{s.year}^</td^>^</tr^>^)}^</tbody^>
echo       ^</table^>
echo     ^</div^>
echo   ^);
echo }
echo export default Students;
) > apps\web\src\pages\Students.js

:: Faculty.js
(
echo import React, { useState } from 'react';
echo function Faculty^(^) {
echo   const [faculty, setFaculty] = useState^([]^);
echo   const [form, setForm] = useState^({ name:'', email:'', department:'' }^);
echo   const handleAdd = ^(^) =^> {
echo     if ^(!form.name^) return;
echo     setFaculty^([...faculty, { ...form, id: Date.now^(^) }]^);
echo     setForm^({ name:'', email:'', department:'' }^);
echo   };
echo   const thStyle = {padding:'12px',textAlign:'left'};
echo   const tdStyle = {padding:'12px',borderBottom:'1px solid #eee'};
echo   return ^(
echo     ^<div style={{padding:'20px',flex:1}}^>
echo       ^<h1^>Faculty Management^</h1^>
echo       ^<div style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',marginBottom:'20px'}}^>
echo         ^<h3^>Add Faculty^</h3^>
echo         ^<input placeholder='Name' value={form.name} onChange={e=^>setForm^({...form,name:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Email' value={form.email} onChange={e=^>setForm^({...form,email:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Department' value={form.department} onChange={e=^>setForm^({...form,department:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<button onClick={handleAdd} style={{margin:'5px',padding:'8px 16px',background:'#28a745',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}^>Add^</button^>
echo       ^</div^>
echo       ^<table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)'}}^>
echo         ^<thead style={{background:'#35424a',color:'#fff'}}^>^<tr^>^<th style={thStyle}^>Name^</th^>^<th style={thStyle}^>Email^</th^>^<th style={thStyle}^>Department^</th^>^</tr^>^</thead^>
echo         ^<tbody^>{faculty.length===0?^<tr^>^<td colSpan='3' style={{textAlign:'center',padding:'20px',color:'#888'}}^>No faculty yet^</td^>^</tr^>:faculty.map^(f=^>^<tr key={f.id}^>^<td style={tdStyle}^>{f.name}^</td^>^<td style={tdStyle}^>{f.email}^</td^>^<td style={tdStyle}^>{f.department}^</td^>^</tr^>^)}^</tbody^>
echo       ^</table^>
echo     ^</div^>
echo   ^);
echo }
echo export default Faculty;
) > apps\web\src\pages\Faculty.js

:: Finance.js
(
echo import React, { useState } from 'react';
echo function Finance^(^) {
echo   const [records, setRecords] = useState^([]^);
echo   const [form, setForm] = useState^({ studentName:'', amount:'', description:'' }^);
echo   const handleAdd = ^(^) =^> {
echo     if ^(!form.studentName ^|^| !form.amount^) return;
echo     setRecords^([...records, { ...form, id: Date.now^(^), date: new Date^(^).toLocaleDateString^(^) }]^);
echo     setForm^({ studentName:'', amount:'', description:'' }^);
echo   };
echo   const total = records.reduce^(^(sum, r^) =^> sum + Number^(r.amount^), 0^);
echo   const thStyle = {padding:'12px',textAlign:'left'};
echo   const tdStyle = {padding:'12px',borderBottom:'1px solid #eee'};
echo   return ^(
echo     ^<div style={{padding:'20px',flex:1}}^>
echo       ^<h1^>Finance Management^</h1^>
echo       ^<div style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',marginBottom:'20px'}}^>
echo         ^<h3^>Add Record^</h3^>
echo         ^<input placeholder='Student Name' value={form.studentName} onChange={e=^>setForm^({...form,studentName:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Amount' type='number' value={form.amount} onChange={e=^>setForm^({...form,amount:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'120px'}} /^>
echo         ^<input placeholder='Description' value={form.description} onChange={e=^>setForm^({...form,description:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<button onClick={handleAdd} style={{margin:'5px',padding:'8px 16px',background:'#ffc107',color:'#000',border:'none',borderRadius:'4px',cursor:'pointer'}}^>Add^</button^>
echo       ^</div^>
echo       ^<div style={{background:'#fff',padding:'15px 20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',marginBottom:'20px'}}^>^<strong^>Total Collected: Rs.{total.toLocaleString^(^)}^</strong^>^</div^>
echo       ^<table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)'}}^>
echo         ^<thead style={{background:'#35424a',color:'#fff'}}^>^<tr^>^<th style={thStyle}^>Student^</th^>^<th style={thStyle}^>Amount^</th^>^<th style={thStyle}^>Description^</th^>^<th style={thStyle}^>Date^</th^>^</tr^>^</thead^>
echo         ^<tbody^>{records.length===0?^<tr^>^<td colSpan='4' style={{textAlign:'center',padding:'20px',color:'#888'}}^>No records yet^</td^>^</tr^>:records.map^(r=^>^<tr key={r.id}^>^<td style={tdStyle}^>{r.studentName}^</td^>^<td style={tdStyle}^>Rs.{Number^(r.amount^).toLocaleString^(^)}^</td^>^<td style={tdStyle}^>{r.description}^</td^>^<td style={tdStyle}^>{r.date}^</td^>^</tr^>^)}^</tbody^>
echo       ^</table^>
echo     ^</div^>
echo   ^);
echo }
echo export default Finance;
) > apps\web\src\pages\Finance.js

:: Inventory.js
(
echo import React, { useState } from 'react';
echo function Inventory^(^) {
echo   const [items, setItems] = useState^([]^);
echo   const [form, setForm] = useState^({ name:'', quantity:'', category:'' }^);
echo   const handleAdd = ^(^) =^> {
echo     if ^(!form.name^) return;
echo     setItems^([...items, { ...form, id: Date.now^(^) }]^);
echo     setForm^({ name:'', quantity:'', category:'' }^);
echo   };
echo   const thStyle = {padding:'12px',textAlign:'left'};
echo   const tdStyle = {padding:'12px',borderBottom:'1px solid #eee'};
echo   return ^(
echo     ^<div style={{padding:'20px',flex:1}}^>
echo       ^<h1^>Inventory Management^</h1^>
echo       ^<div style={{background:'#fff',padding:'20px',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)',marginBottom:'20px'}}^>
echo         ^<h3^>Add Item^</h3^>
echo         ^<input placeholder='Item Name' value={form.name} onChange={e=^>setForm^({...form,name:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'180px'}} /^>
echo         ^<input placeholder='Quantity' type='number' value={form.quantity} onChange={e=^>setForm^({...form,quantity:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'100px'}} /^>
echo         ^<input placeholder='Category' value={form.category} onChange={e=^>setForm^({...form,category:e.target.value}^)} style={{margin:'5px',padding:'8px',width:'160px'}} /^>
echo         ^<button onClick={handleAdd} style={{margin:'5px',padding:'8px 16px',background:'#dc3545',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'}}^>Add^</button^>
echo       ^</div^>
echo       ^<table style={{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:'8px',boxShadow:'0 2px 5px rgba^(0,0,0,0.1^)'}}^>
echo         ^<thead style={{background:'#35424a',color:'#fff'}}^>^<tr^>^<th style={thStyle}^>Item^</th^>^<th style={thStyle}^>Quantity^</th^>^<th style={thStyle}^>Category^</th^>^</tr^>^</thead^>
echo         ^<tbody^>{items.length===0?^<tr^>^<td colSpan='3' style={{textAlign:'center',padding:'20px',color:'#888'}}^>No items yet^</td^>^</tr^>:items.map^(i=^>^<tr key={i.id}^>^<td style={tdStyle}^>{i.name}^</td^>^<td style={tdStyle}^>{i.quantity}^</td^>^<td style={tdStyle}^>{i.category}^</td^>^</tr^>^)}^</tbody^>
echo       ^</table^>
echo     ^</div^>
echo   ^);
echo }
echo export default Inventory;
) > apps\web\src\pages\Inventory.js

echo.
echo All files created successfully!
echo.
echo Now run:  pnpm --filter vaish-erp-web start
echo.
pause
