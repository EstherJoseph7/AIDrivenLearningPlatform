import { useState, useEffect } from 'react';
import { getMyHistory } from '../api';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import './History.css';

interface Prompt {
    _id: string;
    prompt: string;
    response: string;
    created_at: string;
    category_id: { name: string };
    sub_category_id: { name: string };
}

export default function History() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyHistory()
            .then(res => setPrompts(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page">
            <Navbar />
            <div className="history-container">
                <div className="dashboard-header">
                    <h2>Learning History</h2>
                    <p>All your AI-generated lessons in one place.</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <span className="spinner-large" />
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="empty-state">
                        <span>✦</span>
                        <p>No lessons yet. Start learning!</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {prompts.map(p => (
                            <div key={p._id} className="history-card" onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                                <div className="history-card-header">
                                    <div className="history-meta">
                                        <span className="history-category">{p.category_id?.name}</span>
                                        <span className="history-subcategory">{p.sub_category_id?.name}</span>
                                    </div>
                                    <span className="history-date">
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="history-prompt">"{p.prompt}"</p>
                                {expanded === p._id && (
                                    <div className={`history-response ${
                                        // Apply RTL layout when the AI response contains Hebrew characters
                                        /[\u0590-\u05FF]/.test(p.response) ? 'rtl' : ''
                                    }`}>
                                        <ReactMarkdown>{p.response}</ReactMarkdown>
                                    </div>
                                )}
                                <span className="expand-hint">{expanded === p._id ? '▲ Hide lesson' : '▼ View lesson'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
