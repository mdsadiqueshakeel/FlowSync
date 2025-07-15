import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';

const SupportTicketsApp = lazy(() => import('support_tickets/TicketsApp'));

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <Routes>
          <Route path="/" element={<h1 className="text-xl font-bold">Welcome to Dashboard</h1>} />
          <Route
            path="support-tickets"
            element={
              <Suspense fallback={<p>Loading Support Tickets...</p>}>
                <SupportTicketsApp />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
