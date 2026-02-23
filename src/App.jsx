import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SongsPage from './pages/SongsPage';
import UsersPage from './pages/UsersPage';
import UploadPage from './pages/UploadPage';
import AnalyticsPage from './pages/AnalyticsPage';

// ─── Protected route wrapper ──────────────────────────────────
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};
// ─── App ──────────────────────────────────────────────────────
const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: 13 },
                    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/songs" element={<SongsPage />} />
                                    <Route path="/upload" element={<UploadPage />} />
                                    <Route path="/users" element={<UsersPage />} />
                                    <Route path="/analytics" element={<AnalyticsPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);

export default App;
