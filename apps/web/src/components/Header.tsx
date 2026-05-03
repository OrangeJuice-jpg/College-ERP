import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>Vaish College of Engineering ERP</h1>
            <nav>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
                    <li><Link to="/" style={{ color: '#fff' }}>Dashboard</Link></li>
                    <li><Link to="/students" style={{ color: '#fff' }}>Students</Link></li>
                    <li><Link to="/faculty" style={{ color: '#fff' }}>Faculty</Link></li>
                    <li><Link to="/finance" style={{ color: '#fff' }}>Finance</Link></li>
                    <li><Link to="/inventory" style={{ color: '#fff' }}>Inventory</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
