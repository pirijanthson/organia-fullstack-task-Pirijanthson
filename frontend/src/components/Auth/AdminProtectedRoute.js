import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout/AdminLayout';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  if (!token || role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      {children}
    </AdminLayout>
  );
};

export default AdminProtectedRoute;
