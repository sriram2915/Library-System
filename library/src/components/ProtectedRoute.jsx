import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
}
