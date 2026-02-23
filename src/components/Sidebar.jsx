import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Music2, Users, BarChart3,
    Upload, LogOut, Radio, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/songs', icon: Music2, label: 'Songs' },
    { to: '/upload', icon: Upload, label: 'Upload Song' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside style={styles.sidebar}>
            {/* Logo */}
            <div style={styles.brand}>
                <div style={styles.logoIcon}>
                    <Radio size={20} color="#fff" />
                </div>
                <div>
                    <div style={styles.logoTitle}>Rhythm</div>
                    <div style={styles.logoSub}>Admin Panel</div>
                </div>
            </div>

            {/* User badge */}
            <div style={styles.userBadge}>
                <div style={styles.avatar}>
                    {user?.avatar
                        ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} />
                        : <span style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</span>
                    }
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={styles.userName}>{user?.name}</div>
                    <div style={styles.userRole}>
                        <span style={styles.roleBadge}>ADMIN</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
                <div style={styles.navLabel}>NAVIGATION</div>
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        style={({ isActive }) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.navItemActive : {}),
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <div style={{ ...styles.navIcon, ...(isActive ? styles.navIconActive : {}) }}>
                                    <Icon size={17} />
                                </div>
                                <span style={styles.navText}>{label}</span>
                                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: 240,
        minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        flexShrink: 0,
    },
    brand: {
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
        paddingBottom: 20, borderBottom: '1px solid var(--border)',
    },
    logoIcon: {
        width: 38, height: 38, borderRadius: 10,
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)' },
    logoSub: { fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.8px', textTransform: 'uppercase' },

    userBadge: {
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        background: 'var(--card)', borderRadius: 'var(--radius)', marginBottom: 24,
    },
    avatar: {
        width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary-d), var(--primary))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { color: '#fff', fontWeight: 700, fontSize: 14 },
    userName: { fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    userRole: { marginTop: 2 },
    roleBadge: {
        fontSize: 9, letterSpacing: '1px', fontWeight: 700, color: 'var(--primary-l)',
        background: 'rgba(124,58,237,0.15)', padding: '2px 6px', borderRadius: 4,
    },
    nav: { flex: 1 },
    navLabel: {
        fontSize: 10, color: 'var(--text-3)', letterSpacing: '1px', fontWeight: 600,
        textTransform: 'uppercase', marginBottom: 8, paddingLeft: 8,
    },
    navItem: {
        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
        borderRadius: 'var(--radius-sm)', marginBottom: 2, textDecoration: 'none',
        color: 'var(--text-2)', fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
        cursor: 'pointer',
    },
    navItemActive: { background: 'rgba(124,58,237,0.14)', color: 'var(--text)' },
    navIcon: {
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 7, color: 'var(--text-3)',
    },
    navIconActive: { color: 'var(--primary-l)' },
    navText: { flex: 1 },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
        borderRadius: 'var(--radius-sm)', background: 'transparent',
        color: 'var(--text-3)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        border: '1px solid var(--border)', width: '100%', marginTop: 8,
        transition: 'all 0.15s',
    },
};

export default Sidebar;
