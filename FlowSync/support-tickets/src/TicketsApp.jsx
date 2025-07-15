import { useState, useEffect } from "react";
import axios from "axios";

const TicketsApp = () => {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me/tickets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTickets(res.data.tickets);
    } catch (err) {
      console.error("❌ Error fetching tickets:", err.message);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTitle("");
      fetchTickets(); // Refresh after creation
    } catch (err) {
      console.error("❌ Error creating ticket:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000); // 🌀 polling every 5s

    return () => clearInterval(interval); // 🧹 cleanup
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">🎫 Support Tickets</h1>

      <form onSubmit={createTicket} className="flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Enter ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{ticket.title}</h2>
              <p className="text-sm text-gray-500">Status: {ticket.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsApp;
