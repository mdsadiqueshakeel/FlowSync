import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from 'react';

const SupportTicketsApp = lazy(() => import('support_tickets/TicketsApp'));
import AdminDashboard from "../pages/AdminDashboard"; 
import AuditLog from "../pages/AuditLog";

const Dashboard = () => {
  // Force a re-render of the component when the route changes to ensure styles are applied
  useEffect(() => {
    // This is a workaround to ensure Tailwind styles are applied to dynamically loaded components
    const refreshStyles = () => {
      const styleSheets = document.querySelectorAll('style');
      styleSheets.forEach(sheet => {
        const parent = sheet.parentNode;
        if (parent) {
          parent.removeChild(sheet);
          parent.appendChild(sheet);
        }
      });
    };
    
    refreshStyles();
    return () => {};
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="p-6 flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h1>} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />         
          <Route path="audit-log" element={<AuditLog/>} />
          <Route
            path="support-tickets"
            element={
              <Suspense fallback={<div className="flex items-center justify-center h-64">
                <p className="text-gray-600">Loading Support Tickets...</p>
              </div>}>
                <div className="bg-white rounded-lg shadow p-4">
                  <SupportTicketsApp />
                </div>
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
