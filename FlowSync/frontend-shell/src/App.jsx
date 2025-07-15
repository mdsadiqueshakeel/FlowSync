import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
