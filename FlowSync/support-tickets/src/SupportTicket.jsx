// support-tickets/src/SupportTickets.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.tickets);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">My Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <ul className="space-y-2">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="p-3 border rounded bg-white shadow">
              <div className="font-medium">{ticket.title}</div>
              <div className="text-sm text-gray-500">Status: {ticket.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupportTickets;
