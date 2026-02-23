import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Heart, Mic2 } from 'lucide-react';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ color: 'var(--text-3)', fontSize: 11, marginBottom: 4 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>{p.name}: {p.value?.toLocaleString()}</div>
            ))}
        </div>
    );
};

const SectionCard = ({ title, icon: Icon, iconColor, children }) => (
    <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Icon size={18} color={iconColor} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        </div>
        {children}
    </div>
);

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getAnalytics()
            .then(setData)
            .catch(e => toast.error(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 14 }} />)}
        </div>
    );

    const { dailyPlays = [], topArtists = [], likesLeaderboard = [], newUsersPerDay = [] } = data || {};

    // Format dates for chart
    const formatDate = (d) => d ? d.slice(5) : ''; // MM-DD format

    return (
        <div className="fade-in" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Analytics</h1>
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>30-day performance overview</p>
            </div>

            {/* Row 1: plays + new users */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <SectionCard title="Daily Plays" icon={TrendingUp} iconColor="var(--primary-l)">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={dailyPlays.map(d => ({ ...d, date: formatDate(d._id) }))}>
                            <defs>
                                <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                            <YAxis stroke="var(--text-3)" tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="plays" name="Plays" stroke="#7c3aed" strokeWidth={2} fill="url(#ap)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="New Users Per Day" icon={Users} iconColor="var(--accent)">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={newUsersPerDay.map(d => ({ ...d, date: formatDate(d._id) }))}>
                            <defs>
                                <linearGradient id="au" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                            <YAxis stroke="var(--text-3)" tick={{ fontSize: 10 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="users" name="New Users" stroke="#06b6d4" strokeWidth={2} fill="url(#au)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </SectionCard>
            </div>

            {/* Row 2: top artists bar + likes leaderboard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <SectionCard title="Top Artists by Plays" icon={Mic2} iconColor="var(--orange)">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={topArtists} layout="vertical" margin={{ left: 0, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis type="number" stroke="var(--text-3)" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="_id" stroke="var(--text-3)" tick={{ fontSize: 10 }} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalPlays" name="Plays" radius={[0, 6, 6, 0]}>
                                {topArtists.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="Most Liked Songs" icon={Heart} iconColor="var(--red)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {likesLeaderboard.slice(0, 8).map((s, i) => (
                            <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ color: 'var(--text-3)', fontSize: 11, width: 16, textAlign: 'center' }}>#{i + 1}</span>
                                {s.coverImage && <img src={s.coverImage} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />}
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{s.artist}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: 'var(--red)', fontSize: 11 }}>♥ {s.likesCount?.toLocaleString() ?? 0}</span>
                                    <span style={{ color: 'var(--text-3)', fontSize: 10 }}>▶ {s.playCount?.toLocaleString() ?? 0}</span>
                                </div>
                            </div>
                        ))}
                        {likesLeaderboard.length === 0 && <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No data yet</p>}
                    </div>
                </SectionCard>
            </div>

            {/* Genre pie */}
            {topArtists.length > 0 && (
                <SectionCard title="Artist Distribution" icon={TrendingUp} iconColor="var(--green)">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={topArtists.slice(0, 8).map(a => ({ name: a._id, value: a.totalPlays }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                {topArtists.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--text-2)', fontSize: 11 }}>{v}</span>} />
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </SectionCard>
            )}
        </div>
    );
};

export default AnalyticsPage;
