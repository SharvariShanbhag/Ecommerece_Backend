import Login from './PAGES/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import DashboardRoutes from './Routes/DashboaredRoute';
import Layout from './PAGES/Layout';
import Dashboard from './PAGES/Dashboard';
import Profile from './PAGES/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {DashboardRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;