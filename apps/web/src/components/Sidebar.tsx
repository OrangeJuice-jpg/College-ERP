import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Vaish ERP</h2>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/students">Students</Link></li>
                <li><Link to="/attendance">Attendance</Link></li>
                <li><Link to="/faculty">Faculty</Link></li>
                <li><Link to="/finance">Finance</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
