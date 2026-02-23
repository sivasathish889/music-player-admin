import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            {children}
        </main>
    </div>
);

export default Layout;
