import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { analyzeCodeAPI } from '../services/api';
import type { Review } from '../types';

// ── TYPE HELPERS ──────────────────────────────────────────────
// These types fix the "children implicitly has any type" errors
interface ChildrenProps {
    children?: ReactNode;
}
interface CodeProps {
    children?: ReactNode;
    className?: string;
}

// Supported programming languages
const LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'go',
    'rust',
    'php',
    'swift',
];

const DashboardPage = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!code.trim()) {
            toast.error('Please paste some code first!');
            return;
        }
        setLoading(true);
        setReview(null);
        try {
            const res = await analyzeCodeAPI({ code, language });
            setReview(res.data);
            toast.success('Code reviewed successfully! 🎉');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Review failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: '#f1f5f9', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        🤖 AI Code Reviewer
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        Paste your code below and get instant AI feedback on bugs, improvements, and best practices.
                    </p>
                </div>

                {/* LANGUAGE SELECTOR */}
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ color: '#94a3b8', fontWeight: 'bold' }}>Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            background: '#1e293b', color: '#f1f5f9',
                            border: '1px solid #334155', padding: '0.5rem 1rem',
                            borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer',
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CODE INPUT */}
                <div style={{ position: 'relative' }}>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={`// Paste your ${language} code here...`}
                        rows={18}
                        style={{
                            width: '100%', background: '#1e293b', color: '#e2e8f0',
                            border: '1px solid #334155', borderRadius: '12px',
                            padding: '1.25rem', fontSize: '0.9rem',
                            fontFamily: "'Courier New', Courier, monospace",
                            boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6',
                        }}
                    />
                    <span style={{
                        position: 'absolute', bottom: '1rem', right: '1rem',
                        color: '#475569', fontSize: '0.75rem',
                    }}>
                        {code.length} chars
                    </span>
                </div>

                {/* BUTTONS */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        style={{
                            padding: '0.875rem 2rem',
                            background: loading ? '#0e7490' : '#38bdf8',
                            color: '#0f172a', border: 'none', borderRadius: '8px',
                            fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        {loading ? '⏳ Analyzing Code...' : '🔍 Review My Code'}
                    </button>
                    <button
                        onClick={() => { setCode(''); setReview(null); }}
                        style={{
                            padding: '0.875rem 1.5rem', background: 'transparent',
                            color: '#94a3b8', border: '1px solid #334155',
                            borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
                        }}
                    >
                        🗑️ Clear
                    </button>
                </div>

                {/* LOADING */}
                {loading && (
                    <div style={{
                        marginTop: '2rem', background: '#1e293b', borderRadius: '12px',
                        padding: '2rem', textAlign: 'center', border: '1px solid #334155',
                    }}>
                        <p style={{ color: '#38bdf8', fontSize: '1.1rem' }}>🤖 AI is reviewing your code...</p>
                        <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            This may take 10-20 seconds
                        </p>
                    </div>
                )}

                {/* AI FEEDBACK */}
                {review && !loading && (
                    <div style={{
                        marginTop: '2rem', background: '#1e293b', borderRadius: '12px',
                        padding: '1.5rem', border: '1px solid #38bdf8',
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)',
                    }}>
                        {/* Feedback Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '1.5rem',
                            paddingBottom: '1rem', borderBottom: '1px solid #334155',
                        }}>
                            <h3 style={{ color: '#38bdf8', fontSize: '1.2rem' }}>✅ AI Feedback</h3>
                            <span style={{
                                background: '#0f172a', color: '#64748b',
                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem',
                            }}>
                                {review.language}
                            </span>
                        </div>

                        {/* Rendered Markdown */}
                        <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }: ChildrenProps) => (
                                        <h1 style={{ color: '#38bdf8', fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>{children}</h1>
                                    ),
                                    h2: ({ children }: ChildrenProps) => (
                                        <h2 style={{ color: '#38bdf8', fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h2>
                                    ),
                                    h3: ({ children }: ChildrenProps) => (
                                        <h3 style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{children}</h3>
                                    ),
                                    p: ({ children }: ChildrenProps) => (
                                        <p style={{ marginBottom: '0.75rem', color: '#cbd5e1', lineHeight: '1.8' }}>{children}</p>
                                    ),
                                    strong: ({ children }: ChildrenProps) => (
                                        <strong style={{ color: '#f1f5f9', fontWeight: '600' }}>{children}</strong>
                                    ),
                                    code: ({ children, className }: CodeProps) => {
                                        const isBlock = !!className;
                                        if (isBlock) {
                                            return (
                                                <code style={{ display: 'block', color: '#e2e8f0', fontFamily: "'Courier New', monospace", fontSize: '0.875rem', lineHeight: '1.6' }}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <code style={{ background: '#0f172a', color: '#38bdf8', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem', fontFamily: "'Courier New', monospace" }}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    pre: ({ children }: ChildrenProps) => (
                                        <pre style={{ background: '#0f172a', border: '1px solid #334155', padding: '1rem 1.25rem', borderRadius: '8px', overflowX: 'auto', marginTop: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', fontFamily: "'Courier New', monospace", lineHeight: '1.6' }}>
                                            {children}
                                        </pre>
                                    ),
                                    ul: ({ children }: ChildrenProps) => (
                                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{children}</ul>
                                    ),
                                    ol: ({ children }: ChildrenProps) => (
                                        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#cbd5e1' }}>{children}</ol>
                                    ),
                                    li: ({ children }: ChildrenProps) => (
                                        <li style={{ marginBottom: '0.4rem', color: '#cbd5e1', lineHeight: '1.7' }}>{children}</li>
                                    ),
                                    hr: () => (
                                        <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '1.25rem 0' }} />
                                    ),
                                    blockquote: ({ children }: ChildrenProps) => (
                                        <blockquote style={{ borderLeft: '3px solid #38bdf8', paddingLeft: '1rem', margin: '1rem 0', color: '#94a3b8', fontStyle: 'italic' }}>
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {review.feedback}
                            </ReactMarkdown>
                        </div>

                        <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                            💾 Review saved to history
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;