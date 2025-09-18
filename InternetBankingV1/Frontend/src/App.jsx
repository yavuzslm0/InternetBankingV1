import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Converter from "./pages/DovizConverter";
import Chart from "./pages/DovizChart";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Transfer from "./pages/Transfer"; 
import Transactions from "./pages/Transactions"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ======================= AUTH SAYFALARI ======================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* ======================= DASHBOARD VE PROTECTED SAYFALAR ======================= */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Router>
  );
}
