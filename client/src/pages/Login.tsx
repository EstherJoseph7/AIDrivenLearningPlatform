import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { decodeToken } from '../utils/auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login({ userId, password });
            const token = res.data.token;
            // Persist auth data in localStorage for use across page reloads
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            const payload = decodeToken(token);
            localStorage.setItem('role', payload.role);
            // Redirect admins to the admin panel, regular users to the dashboard
            navigate(payload.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-glow" />
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">✦</span>
                    <h1>LearnAI</h1>
                </div>
                <p className="auth-subtitle">Welcome back! Sign in to continue learning.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>ID Number</label>
                        <input
                            type="text"
                            placeholder="Enter your ID"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
