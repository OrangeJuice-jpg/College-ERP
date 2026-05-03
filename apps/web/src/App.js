import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import './styles/index.css';
function App() {
  return (
    <Router>
      <div className='app'>
        <Header />
        <div className='main-content'>
          <Sidebar />
          <Switch>
            <Route path='/' exact component={Dashboard} />
            <Route path='/students' component={Students} />
            <Route path='/faculty' component={Faculty} />
            <Route path='/finance' component={Finance} />
            <Route path='/inventory' component={Inventory} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
