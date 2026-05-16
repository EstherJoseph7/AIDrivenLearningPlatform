import { useState, useEffect, useRef, useCallback } from 'react';
import { getCategories, getSubCategories, sendPrompt } from '../api';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import './Dashboard.css';

interface Category { _id: string; name: string; }
interface SubCategory { _id: string; name: string; }

export default function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [category_id, setCategoryId] = useState('');
    const [sub_category_id, setSubCategoryId] = useState('');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [responseKey, setResponseKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const responseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!category_id) return;
        setSubCategoryId('');
        getSubCategories(category_id).then(res => setSubCategories(res.data)).catch(() => {});
    }, [category_id]);

    // Show floating button when response card is scrolled out of view
    const checkResponseVisibility = useCallback(() => {
        if (!responseRef.current || !response) {
            setShowScrollBtn(false);
            return;
        }
        const rect = responseRef.current.getBoundingClientRect();
        setShowScrollBtn(rect.top > window.innerHeight || rect.bottom < 0);
    }, [response]);

    useEffect(() => {
        window.addEventListener('scroll', checkResponseVisibility);
        return () => window.removeEventListener('scroll', checkResponseVisibility);
    }, [checkResponseVisibility]);

    const scrollToResponse = () => {
        if (responseRef.current) {
            responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ref callback — fires the moment the element is mounted in the DOM
    // Using responseKey as part of the key prop forces a fresh mount on every new response
    const responseCardRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            responseRef.current = node;
            const top = node.getBoundingClientRect().top + window.scrollY - 84;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, [responseKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponse('');
        setShowScrollBtn(false);
        try {
            const res = await sendPrompt({ category_id, sub_category_id, prompt });
            setResponseKey(k => k + 1);
            setResponse(res.data.response);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to generate lesson.');
        } finally {
            setLoading(false);
        }
    };

    const isHebrew = (text: string) => /[֐-׿]/.test(text);

    return (
        <div className="page">
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>What do you want to learn today?</h2>
                    <p>Select a topic and let AI create a personalized lesson for you.</p>
                </div>

                <div className="dashboard-content">
                    <div className="form-card">
                        <form onSubmit={handleSubmit} className="learn-form">
                            <div className="form-group">
                                <label>Category</label>
                                <select value={category_id} onChange={e => setCategoryId(e.target.value)} required>
                                    <option value="">Select a category...</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sub-Category</label>
                                <select value={sub_category_id} onChange={e => setSubCategoryId(e.target.value)} required disabled={!category_id}>
                                    <option value="">Select a sub-category...</option>
                                    {subCategories.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Your Prompt</label>
                                <textarea
                                    placeholder="e.g. Teach me about black holes..."
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>

                            {error && <p className="error-msg">{error}</p>}

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner" /> Generating lesson...</> : '✦ Generate Lesson'}
                            </button>
                        </form>
                    </div>

                    {response && (
                        <div key={responseKey} className="response-card" ref={responseCardRef}>
                            <div className="response-header">
                                <span className="response-icon">✦</span>
                                <h3>Your AI Lesson</h3>
                            </div>
                            <div className={`response-content ${isHebrew(response) ? 'rtl' : ''}`}>
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating button — appears when the response card is scrolled out of view */}
            {showScrollBtn && (
                <button
                    className="scroll-to-response-btn"
                    onClick={scrollToResponse}
                    aria-label="Scroll to AI response"
                >
                    ✦ Scroll to Answer ↓
                </button>
            )}
        </div>
    );
}
