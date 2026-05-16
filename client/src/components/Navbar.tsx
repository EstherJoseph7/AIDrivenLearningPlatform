import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <span className="logo-icon">✦</span>
                <span>LearnAI</span>
            </div>
            <div className="navbar-links">
                {role === 'admin' ? (
                    <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin Panel</Link>
                ) : (
                    <>
                        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Learn</Link>
                        <Link to="/history" className={isActive('/history') ? 'active' : ''}>History</Link>
                    </>
                )}
            </div>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
        </nav>
    );
}
