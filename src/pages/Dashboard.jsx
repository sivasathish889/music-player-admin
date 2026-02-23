import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { Users, Music2, ListMusic, Headphones, TrendingUp, Clock, Play } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div style={{ ...sc.card, borderColor: color + '22' }}>
        <div style={{ ...sc.iconWrap, background: color + '18' }}>
            <Icon size={20} color={color} />
        </div>
        <div style={sc.val}>{typeof value === 'number' ? value.toLocaleString() : value ?? '—'}</div>
        <div style={sc.label}>{label}</div>
        {sub && <div style={sc.sub}>{sub}</div>}
    </div>
);

const sc = {
    card: {
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: '20px 22px',
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8,
        transition: 'border-color 0.2s',
    },
    iconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    val: { fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: -1 },
    label: { fontSize: 13, color: 'var(--text-2)', fontWeight: 500 },
    sub: { fontSize: 11, color: 'var(--text-3)' },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ color: 'var(--text-3)', fontSize: 11, marginBottom: 4 }}>{label}</div>
            <div style={{ color: 'var(--text)', fontWeight: 700 }}>{payload[0]?.value?.toLocaleString()} plays</div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getStats()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 14 }} />)}
        </div>
    );

    const { stats, chartData = [], topSongs = [], recentUsers = [] } = data || {};

    return (
        <div className="fade-in" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Page header */}
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Welcome back — here's what's happening</p>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="var(--accent)" />
                <StatCard icon={Music2} label="Total Songs" value={stats?.totalSongs} color="var(--primary-l)" />
                <StatCard icon={ListMusic} label="Playlists" value={stats?.totalPlaylists} color="var(--green)" />
                <StatCard icon={Headphones} label="Total Plays" value={stats?.totalPlays} color="var(--orange)" />
            </div>

            {/* Play trend chart */}
            {chartData.length > 0 && (
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <TrendingUp size={18} color="var(--primary-l)" />
                        <span style={{ fontWeight: 700, fontSize: 15 }}>Monthly Plays</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
                            <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="plays" stroke="var(--primary-l)" strokeWidth={2} fill="url(#pg)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Bottom 2-col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Top songs */}
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Play size={16} color="var(--orange)" />
                        <span style={{ fontWeight: 700, fontSize: 14 }}>Top Songs</span>
                    </div>
                    {topSongs.map((s, i) => (
                        <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < topSongs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <span style={{ color: 'var(--text-3)', fontSize: 12, width: 16, textAlign: 'center' }}>#{i + 1}</span>
                            {s.coverImage && <img src={s.coverImage} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.artist}</div>
                            </div>
                            <div style={{ color: 'var(--text-3)', fontSize: 11 }}>{s.playCount?.toLocaleString()} plays</div>
                        </div>
                    ))}
                    {topSongs.length === 0 && <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No data yet</p>}
                </div>

                {/* Recent users */}
                <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Clock size={16} color="var(--accent)" />
                        <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Users</span>
                    </div>
                    {recentUsers.map((u) => (
                        <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,var(--primary-d),var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{u.name?.[0]?.toUpperCase()}</span>
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{u.email}</div>
                            </div>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: u.role === 'admin' ? 'rgba(124,58,237,0.15)' : 'rgba(6,182,212,0.12)', color: u.role === 'admin' ? 'var(--primary-l)' : 'var(--accent)', fontWeight: 700, letterSpacing: '0.5px' }}>
                                {u.role.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
