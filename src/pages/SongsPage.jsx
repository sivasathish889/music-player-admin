import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Play, RefreshCw } from 'lucide-react';

const SongsPage = () => {
    const [songs, setSongs] = useState([]);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const fetchSongs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getSongs({ search, genre, page, limit: 15, sortBy, order });
            setSongs(res.songs || []);
            setGenres(res.genres || []);
            setMeta({ total: res.total, totalPages: res.totalPages });
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    }, [search, genre, page, sortBy, order]);

    useEffect(() => { fetchSongs(); }, [fetchSongs]);

    const handleToggle = async (song) => {
        try {
            const res = await adminAPI.toggleSongStatus(song._id);
            toast.success(res.message);
            setSongs(prev => prev.map(s => s._id === song._id ? { ...s, isActive: res.isActive } : s));
        } catch (e) { toast.error(e.message); }
    };

    const handleDelete = async (song) => {
        if (!window.confirm(`Delete "${song.title}"? This cannot be undone.`)) return;
        try {
            await adminAPI.deleteSong(song._id);
            toast.success('Song deleted');
            setSongs(prev => prev.filter(s => s._id !== song._id));
            setMeta(m => ({ ...m, total: m.total - 1 }));
        } catch (e) { toast.error(e.message); }
    };

    const formatDuration = (s) => {
        if (!s) return '—';
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    };

    const sortClick = (field) => {
        if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc');
        else { setSortBy(field); setOrder('desc'); }
        setPage(1);
    };

    const SortHeader = ({ field, children }) => (
        <th onClick={() => sortClick(field)} style={{ cursor: 'pointer', userSelect: 'none' }}>
            {children} {sortBy === field ? (order === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div className="fade-in" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Songs</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: 13 }}>{meta.total.toLocaleString()} tracks in library</p>
                </div>
                <button onClick={fetchSongs} style={btn.ghost}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ ...inp.wrap, flex: 1 }}>
                    <Search size={15} color="var(--text-3)" />
                    <input style={inp.field} placeholder="Search title, artist, album..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select value={genre} onChange={e => { setGenre(e.target.value); setPage(1); }} style={inp.select}>
                    <option value="">All genres</option>
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div className="scroll-x">
                    <table>
                        <thead>
                            <tr>
                                <th>Song</th>
                                <SortHeader field="artist">Artist</SortHeader>
                                <th>Genre</th>
                                <th>Duration</th>
                                <SortHeader field="playCount">Plays</SortHeader>
                                <SortHeader field="likesCount">Likes</SortHeader>
                                <th>Status</th>
                                <th>Uploaded</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? Array(10).fill(0).map((_, i) => (
                                    <tr key={i}>{Array(9).fill(0).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>
                                ))
                                : songs.map(s => (
                                    <tr key={s._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 220 }}>
                                                <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface2)' }}>
                                                    {s.coverImage
                                                        ? <img src={s.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={14} color="rgba(255,255,255,0.6)" /></div>
                                                    }
                                                </div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                                                    {s.album && <div style={{ color: 'var(--text-3)', fontSize: 11 }}>{s.album}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{s.artist}</td>
                                        <td>
                                            {s.genre && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: 'rgba(124,58,237,0.1)', color: 'var(--primary-l)', fontWeight: 600 }}>{s.genre}</span>}
                                        </td>
                                        <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{formatDuration(s.duration)}</td>
                                        <td style={{ fontWeight: 600 }}>{s.playCount?.toLocaleString() ?? 0}</td>
                                        <td style={{ color: 'var(--text-3)' }}>{s.likesCount?.toLocaleString() ?? 0}</td>
                                        <td>
                                            <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: s.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)', color: s.isActive ? 'var(--green)' : 'var(--red)' }}>
                                                {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-3)', fontSize: 11 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <button onClick={() => handleToggle(s)} style={{ ...btn.icon, color: s.isActive ? 'var(--green)' : 'var(--red)' }} title="Toggle active">
                                                    {s.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                </button>
                                                <button onClick={() => handleDelete(s)} style={{ ...btn.icon, color: 'var(--red)' }} title="Delete">
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
                {meta.totalPages > 1 && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-3)', fontSize: 12, marginRight: 8 }}>Page {page} of {meta.totalPages}</span>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={btn.pag}><ChevronLeft size={15} /></button>
                        <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} style={btn.pag}><ChevronRight size={15} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

const btn = {
    ghost: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer' },
    icon: { width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    pag: { width: 30, height: 30, borderRadius: 7, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
};

const inp = {
    wrap: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', height: 40 },
    field: { border: 'none', background: 'transparent', flex: 1, height: 40, fontSize: 14, outline: 'none', color: 'var(--text)' },
    select: { height: 40, padding: '0 12px', borderRadius: 'var(--radius-sm)', background: 'var(--card)', fontSize: 13, cursor: 'pointer', minWidth: 140 },
};

export default SongsPage;
