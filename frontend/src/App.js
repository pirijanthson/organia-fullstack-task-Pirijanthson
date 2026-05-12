import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddTask from "./pages/AddTask/AddTask";
import Profile from "./pages/Profile/Profile";
import SpecialNotes from "./pages/SpecialNotes/SpecialNotes";
import AddNote from "./pages/AddNote/AddNote";
import ErrorPage from "./pages/Error/Error";
import MainLayout from "./components/Layout/MainLayout/MainLayout";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminUserDetails from "./pages/Admin/AdminUserDetails/AdminUserDetails";
import AdminCreateTask from "./pages/Admin/AdminCreateTask/AdminCreateTask";
import AdminFeedback from "./pages/Admin/AdminFeedback/AdminFeedback";
import AdminNotes from "./pages/Admin/AdminNotes/AdminNotes";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout onLogout={handleLogout}>
      {children}
    </MainLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUserDetails />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/create-task"
          element={
            <AdminProtectedRoute>
              <AdminCreateTask />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-task/:id"
          element={
            <AdminProtectedRoute>
              <AdminCreateTask />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminProtectedRoute>
              <AdminFeedback />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <AdminProtectedRoute>
              <AdminNotes />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AddTask"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-task/:id"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <SpecialNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-note"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-note/:id"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;