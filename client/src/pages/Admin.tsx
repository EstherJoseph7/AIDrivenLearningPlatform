import { useState, useEffect } from 'react';
import { getAdminUsers, getAdminPrompts, getAdminPromptsByUser, createCategory, createSubCategory, getCategories } from '../api';
import Navbar from '../components/Navbar';
import './Admin.css';

interface User { userId: string; name: string; phone: string; }
interface Prompt { _id: string; prompt: string; response: string; created_at: string; user_id: string; category_id: { name: string }; sub_category_id: { name: string }; }
interface Category { _id: string; name: string; }

export default function Admin() {
    const [tab, setTab] = useState<'users' | 'prompts' | 'manage'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState({ name: '', category_id: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [usersPage, setUsersPage] = useState(1);
    const [promptsPage, setPromptsPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [promptsTotalPages, setPromptsTotalPages] = useState(1);

    useEffect(() => {
        getAdminUsers(usersPage).then(res => {
            setUsers(res.data.users);
            setUsersTotalPages(res.data.pages);
        }).catch(() => {});
    }, [usersPage]);

    useEffect(() => {
        getAdminPrompts(promptsPage).then(res => {
            setPrompts(res.data.prompts);
            setPromptsTotalPages(res.data.pages);
        }).catch(() => {});
        
        getCategories().then(res => setCategories(res.data)).catch(() => {});
    }, [promptsPage]);

const handleUserFilter = async (user_id: string) => {
    setSelectedUser(user_id);
    try {
        let res;
        if (!user_id) {
            res = await getAdminPrompts();
            setPrompts(res.data.prompts); 
        } else {
            res = await getAdminPromptsByUser(user_id);
              setPrompts(res.data); 
        }
   
    } catch (error) {
        setPrompts([]);
    }
};

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCategory(newCategory);
            setMessage('Category created successfully!');
            setNewCategory('');
            getCategories().then(res => setCategories(res.data));
        } catch {
            setMessage('Failed to create category.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createSubCategory(newSubCategory.name, newSubCategory.category_id);
            setMessage('Sub-category created successfully!');
            setNewSubCategory({ name: '', category_id: '' });
        } catch {
            setMessage('Failed to create sub-category.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-container">
                <div className="dashboard-header">
                    <h2>Admin Panel</h2>
                    <p>Manage users, lessons, and content.</p>
                </div>

                <div className="admin-tabs">
                    <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
                    <button className={tab === 'prompts' ? 'active' : ''} onClick={() => setTab('prompts')}>Prompts</button>
                    <button className={tab === 'manage' ? 'active' : ''} onClick={() => setTab('manage')}>Manage Content</button>
                </div>

                {tab === 'users' && (
                    <div className="admin-table-card">
                        <table className="admin-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Phone</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.userId}>
                                        <td>{u.userId}</td>
                                        <td>{u.name}</td>
                                        <td>{u.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1}>← Prev</button>
                            <span>Page {usersPage} of {usersTotalPages}</span>
                            <button onClick={() => setUsersPage(p => Math.min(usersTotalPages, p + 1))} disabled={usersPage === usersTotalPages}>Next →</button>
                        </div>
                    </div>
                )}

                {tab === 'prompts' && (
                    <div className="admin-table-card">
                        <div className="filter-bar">
                            <select value={selectedUser} onChange={e => handleUserFilter(e.target.value)}>
                                <option value="">All Users</option>
                                {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
                            </select>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>User</th><th>Category</th><th>Prompt</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                                {Array.isArray(prompts) && prompts.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.user_id}</td>
                                        <td><span className="history-category">{p.category_id?.name}</span></td>
                                        <td>{p.prompt}</td>
                                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setPromptsPage(p => Math.max(1, p - 1))} disabled={promptsPage === 1}>← Prev</button>
                            <span>Page {promptsPage} of {promptsTotalPages}</span>
                            <button onClick={() => setPromptsPage(p => Math.min(promptsTotalPages, p + 1))} disabled={promptsPage === promptsTotalPages}>Next →</button>
                        </div>
                    </div>
                )}

                {tab === 'manage' && (
                    <div className="manage-grid">
                        <div className="form-card">
                            <h3>Add Category</h3>
                            <form onSubmit={handleCreateCategory} className="manage-form">
                                <div className="form-group">
                                    <label>Category Name</label>
                                    <input type="text" placeholder="e.g. Science" value={newCategory} onChange={e => setNewCategory(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>Add Category</button>
                            </form>
                        </div>

                        <div className="form-card">
                            <h3>Add Sub-Category</h3>
                            <form onSubmit={handleCreateSubCategory} className="manage-form">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={newSubCategory.category_id} onChange={e => setNewSubCategory({ ...newSubCategory, category_id: e.target.value })} required>
                                        <option value="">Select category...</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Sub-Category Name</label>
                                    <input type="text" placeholder="e.g. Space" value={newSubCategory.name} onChange={e => setNewSubCategory({ ...newSubCategory, name: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>Add Sub-Category</button>
                            </form>
                        </div>

                        {message && <p className={`manage-message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}