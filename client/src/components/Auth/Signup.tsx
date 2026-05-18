import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signupAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const navigate = useNavigate();

    // ── HANDLE FORM SUBMIT ───────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await signupAPI(form);

            login(res.data.token, res.data.user);

            toast.success('Account created successfully! 🎉');

            navigate('/dashboard');

        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');

        } finally {
            setLoading(false);
        }
    };

    // ── RENDER ───────────────────────────────────────────────────
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',    // Vertical center
            justifyContent: 'center', // Horizontal center
        }}>
            <div style={{
                background: '#1e293b',
                padding: '2.5rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                border: '1px solid #334155',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}>
                {/* Title */}
                <h2 style={{
                    color: '#f1f5f9',
                    marginBottom: '0.5rem',
                    textAlign: 'center',
                    fontSize: '1.75rem',
                }}>
                    Create Account
                </h2>
                <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2rem' }}>
                    Start reviewing code with AI
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            color: '#94a3b8',
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            // ...form = spread current form values (keep email/password)
                            // name: e.target.value = update only name
                            placeholder="John Doe"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#f1f5f9',
                                boxSizing: 'border-box',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            color: '#94a3b8',
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="john@gmail.com"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#f1f5f9',
                                boxSizing: 'border-box',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            color: '#94a3b8',
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                background: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#f1f5f9',
                                boxSizing: 'border-box',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: loading ? '#0e7490' : '#38bdf8',
                            color: '#0f172a',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
                    </button>
                </form>

                {/* Link to Login */}
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;