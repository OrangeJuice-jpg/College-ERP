import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Vaish College of Engineering, Rohtak. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
