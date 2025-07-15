import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 💡 state shape
      setStats({
        total: res.data.total,
        pending: res.data.pending,
        inProgress: res.data.inProgress,
        completed: res.data.completed,
      });

      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📊 Admin Dashboard
      </h1>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          color="bg-indigo-400"
        />
        <StatCard label="Pending" value={stats.pending} color="bg-yellow-400" />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          color="bg-blue-400"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="bg-green-500"
        />
      </div>

      {/* 🧾 Ticket Table */}
      {loading ? (
        <p className="text-gray-500">Loading tickets...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <TableHeader label="Title" />
                <TableHeader label="Tenant" />
                <TableHeader label="Status" />
                <TableHeader label="Created By" />
                <TableHeader label="Created At" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 text-sm">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm">{ticket.customerId}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={ticket.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await axios.patch(
                            `${
                              import.meta.env.VITE_BACKEND_URL
                            }/admin/tickets/${ticket._id}`,
                            { status: newStatus },
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );
                          setTickets((prev) =>
                            prev.map((t) =>
                              t._id === ticket._id
                                ? { ...t, status: newStatus }
                                : t
                            )
                          );
                        } catch (err) {
                          console.error("Failed to update status:", err);
                          alert("❌ Failed to update status");
                        }
                      }}
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ticket.createdBy?.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-xl shadow p-6 text-white ${color}`}>
    <h2 className="text-lg font-semibold">{label}</h2>
    <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
  </div>
);

const TableHeader = ({ label }) => (
  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
    {label}
  </th>
);

export default AdminDashboard;
