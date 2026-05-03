import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Finance from './pages/Finance';
import Attendance from './pages/Attendance';
import './styles/index.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <div className="main-content">
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/faculty" element={<Faculty />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/attendance" element={<Attendance />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;