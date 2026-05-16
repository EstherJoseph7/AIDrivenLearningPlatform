import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../api';
import { decodeToken } from '../utils/auth';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({ userId: '', name: '', phone: '', password: '', adminSecret: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Step 1: Register the new account.
        // adminSecret is only included when the admin checkbox is checked.
        try {
            await register({ ...form, role: 'user', adminSecret: isAdmin ? form.adminSecret : undefined });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed.');
            setLoading(false);
            return;
        }

        // Step 2: Automatically log in after successful registration so the user
        // lands on the correct dashboard without an extra sign-in step.
        try {
            const res = await login({ userId: form.userId, password: form.password });
            const token = res.data.token;
            // Persist auth data in localStorage for use across page reloads
            localStorage.setItem('token', token);
            localStorage.setItem('userId', form.userId);
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
                <p className="auth-subtitle">Create your account and start learning.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>ID Number</label>
                        <input name="userId" type="text" placeholder="9-digit ID" value={form.userId} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" type="text" placeholder="Your phone number" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="admin-checkbox">
                        <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
                        <label htmlFor="isAdmin">Register as Admin</label>
                    </div>
                    {isAdmin && (
                        <div className="form-group">
                            <label>Admin Secret</label>
                            <input name="adminSecret" type="password" placeholder="Enter admin secret" value={form.adminSecret} onChange={handleChange} />
                        </div>
                    )}
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
