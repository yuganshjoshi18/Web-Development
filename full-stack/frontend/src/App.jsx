import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Tasks from './pages/Tasks.jsx';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/tasks" replace /> : <Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<Tasks />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/tasks' : '/login'} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
