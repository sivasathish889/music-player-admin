import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, Trash2, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const ROLES = ['', 'user', 'admin'];

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getUsers({ search, role, page, limit: 15 });
            setUsers(res.users || []);
            setMeta({ total: res.total, totalPages: res.totalPages, currentPage: res.currentPage });
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    }, [search, role, page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await adminAPI.updateUserRole(user._id, newRole);
            toast.success(`${user.name} is now ${newRole}`);
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
        } catch (e) { toast.error(e.message); }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
        setDeleting(user._id);
        try {
            await adminAPI.deleteUser(user._id);
            toast.success('User deleted');
            setUsers(prev => prev.filter(u => u._id !== user._id));
            setMeta(m => ({ ...m, total: m.total - 1 }));
        } catch (e) { toast.error(e.message); }
        finally { setDeleting(null); }
    };

    return (
        <div className="fade-in" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Users</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: 13 }}>{meta.total.toLocaleString()} registered users</p>
                </div>
                <button onClick={fetchUsers} style={btn.ghost}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ ...input.wrap, flex: 1 }}>
                    <Search size={15} color="var(--text-3)" />
                    <input
                        style={input.field}
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }} style={input.select}>
                    <option value="">All roles</option>
                    {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div className="scroll-x">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Liked Songs</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array(8).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        {Array(6).fill(0).map((_, j) => (
                                            <td key={j}><div className="skeleton" style={{ height: 14, borderRadius: 4 }} /></td>
                                        ))}
                                    </tr>
                                ))
                                : users.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--primary-d),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                                    {u.avatar
                                                        ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{u.name?.[0]?.toUpperCase()}</span>
                                                    }
                                                </div>
                                                <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                                        <td>
                                            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.5px', background: u.role === 'admin' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'var(--primary-l)' : 'var(--text-2)' }}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-3)' }}>{u.likedSongs?.length ?? 0}</td>
                                        <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button
                                                    onClick={() => handleRoleToggle(u)}
                                                    title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                                                    style={{ ...btn.icon, color: u.role === 'admin' ? 'var(--primary-l)' : 'var(--text-3)' }}
                                                >
                                                    {u.role === 'admin' ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    disabled={deleting === u._id}
                                                    style={{ ...btn.icon, color: 'var(--red)' }}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-3)', fontSize: 12, marginRight: 8 }}>
                            Page {meta.currentPage} of {meta.totalPages}
                        </span>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={btn.pag}>
                            <ChevronLeft size={15} />
                        </button>
                        <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} style={btn.pag}>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Shared mini style objects ─────────────────────────────────
const btn = {
    ghost: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer' },
    icon: { width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    pag: { width: 30, height: 30, borderRadius: 7, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
};

const input = {
    wrap: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', height: 40 },
    field: { border: 'none', background: 'transparent', flex: 1, height: 40, fontSize: 14, outline: 'none', color: 'var(--text)' },
    select: { height: 40, padding: '0 12px', borderRadius: 'var(--radius-sm)', background: 'var(--card)', fontSize: 13, cursor: 'pointer', minWidth: 140 },
};

export default UsersPage;
