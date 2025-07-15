import { useEffect, useState } from "react";
import axios from "axios";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/audit-logs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // ⏱️ poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Audit Logs</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tenant</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-sm">{log.action}</td>
                <td className="px-6 py-4 text-sm">{log.userId}</td>
                <td className="px-6 py-4 text-sm">{log.customerId}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
