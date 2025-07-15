import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const [screens, setScreens] = useState([]); // ✅ safe default

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me/screens`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setScreens(res.data?.screens || []); // ✅ make sure fallback is [] if undefined
      } catch (err) {
        console.error("❌ Error fetching screens:", err);
        setScreens([]); // fallback again
      }
    };

    fetchScreens();
  }, []);

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">FlowSync</h1>
        <p className="text-gray-400 text-sm">Workflow Management</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
              <span className="mr-3">🏠</span>
              <span>Dashboard</span>
            </Link>
          </li>

          {(screens || []).map((screen, index) => (
            <li key={index}>
              <Link to={`/dashboard/${screen.url}`} className="flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                <span className="mr-3">📄</span>
                <span>{screen.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
