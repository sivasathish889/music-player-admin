import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Radio, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focus, setFocus] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('All fields required'); return; }
        setLoading(true);
        try {
            await login(email.trim().toLowerCase(), password);
            toast.success('Welcome back, Admin 👑');
            navigate('/');
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={styles.root}>
            {/* Animated background blobs */}
            <div style={{ ...styles.blob, top: -100, left: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)' }} />
            <div style={{ ...styles.blob, bottom: -80, right: -60, width: 500, height: 500, background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)' }} />

            <div style={styles.card}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={styles.logoWrap}>
                        <Radio size={22} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Admin Panel</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Sign in with your admin account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Email */}
                    <div>
                        <label style={styles.label}>Email Address</label>
                        <div style={{ ...styles.fieldWrap, borderColor: focus === 'email' ? 'var(--primary)' : 'var(--border)' }}>
                            <Mail size={16} color={focus === 'email' ? 'var(--primary-l)' : 'var(--text-3)'} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                onFocus={() => setFocus('email')}
                                onBlur={() => setFocus(null)}
                                style={{ ...styles.fieldInput }}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={styles.label}>Password</label>
                        <div style={{ ...styles.fieldWrap, borderColor: focus === 'pass' ? 'var(--primary)' : 'var(--border)' }}>
                            <Lock size={16} color={focus === 'pass' ? 'var(--primary-l)' : 'var(--text-3)'} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                onFocus={() => setFocus('pass')}
                                onBlur={() => setFocus(null)}
                                style={{ ...styles.fieldInput, flex: 1 }}
                                autoComplete="current-password"
                            />
                            <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex' }}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.submitBtn}
                    >
                        {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
                    </button>
                </form>

                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 10, border: '1px solid rgba(124,58,237,0.15)' }}>
                    <p style={{ color: 'var(--text-3)', fontSize: 12, textAlign: 'center' }}>
                        🔒 Admin access only. Your account must have the <strong style={{ color: 'var(--primary-l)' }}>admin</strong> role.
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    root: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: 20 },
    blob: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none' },
    card: { width: '100%', maxWidth: 400, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', position: 'relative', zIndex: 1 },
    logoWrap: { width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
    label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 },
    fieldWrap: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface2)', border: '1px solid', borderRadius: 10, padding: '0 12px', height: 46, transition: 'border-color 0.2s' },
    fieldInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, height: '100%' },
    submitBtn: { width: '100%', height: 48, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff', marginTop: 4 },
};

export default LoginPage;
