import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../../services/adminService';
import './AdminUserDetails.css';

const USERS_PER_PAGE = 8;

function AdminUserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.id?.toString().includes(search);
      const matchesRole = selectedRole ? user.role === selectedRole : true;
      return matchesSearch && matchesRole;
    });
  }, [users, search, selectedRole]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRole]);

  const getRoleBadgeClass = (role) => {
    if (role === 'ADMIN') return 'role-badge admin';
    return 'role-badge user';
  };

  return (
    <div className="admin-user-details">
      {/* Header Section */}
      <div className="users-header">
        <div className="header-left">
          <div className="header-badge">
            <span>👥</span>
            User Management
          </div>
          <h1 className="header-title">
            User <span className="gradient-text">Directory</span>
          </h1>
          <p className="header-subtitle">
            Reviewing and assigning tasks to active operators.
          </p>
        </div>
        
        <div className="header-right">
          <div className="search-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-filter"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="users-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👑</span>
          <div>
            <h3>{users.filter(u => u.role === 'ADMIN').length}</h3>
            <p>Administrators</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div>
            <h3>{users.filter(u => u.role !== 'ADMIN').length}</h3>
            <p>Regular Users</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Retrieving user data...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Users Found</h3>
          <p>No users matching your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Users Grid */}
          <div className="users-grid">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="user-card">
                {/* Card Background Decor */}
                <div className="card-decor"></div>
                
                {/* Avatar Section */}
                <div className="user-avatar">
                  <span className="avatar-initial">{user.username?.charAt(0).toUpperCase()}</span>
                  <div className="avatar-status online"></div>
                </div>

                {/* User Info */}
                <div className="user-info">
                  <h3 className="user-name">{user.username}</h3>
                  <p className="user-email">{user.email}</p>
                  <div className="user-meta">
                    <span className="user-id">ID: {user.id}</span>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role || 'USER'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate('/admin/create-task', { 
                    state: { userId: user.id, userName: user.username } 
                  })}
                  className="assign-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Assign Task
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                «
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ‹
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="page-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                ›
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminUserDetails;