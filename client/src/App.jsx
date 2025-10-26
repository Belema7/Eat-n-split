import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Profile from './pages/Profile';
import PrivateRoute from './middlewares/PrivateRoute';

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary dark:bg-gray-900">
        <p className="text-text dark:text-gray-200 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <PrivateRoute>
              <GroupDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary dark:text-blue-300 mb-4">
                  404 - Page Not Found
                </h2>
                <p className="text-text dark:text-gray-200 mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/login"
                  className="text-primary dark:text-blue-300 hover:underline"
                >
                  Back to Login
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;