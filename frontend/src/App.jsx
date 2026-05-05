import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Predictions from './pages/Predictions';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar     from './components/Sidebar';
import Navbar      from './components/Navbar';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{background:'var(--cream)'}}>
    <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{borderColor:'var(--cream-dark)',borderTopColor:'var(--fern)'}}></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <Spinner />;
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen" style={{background:'var(--cream)'}}>
    <Sidebar />
    <div className="flex-1 flex flex-col ml-64">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider><AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard"   element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><MainLayout><Predictions /></MainLayout></ProtectedRoute>} />
          <Route path="/history"     element={<ProtectedRoute><MainLayout><HistoryPage /></MainLayout></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider></ThemeProvider>
  );
}

export default App;
