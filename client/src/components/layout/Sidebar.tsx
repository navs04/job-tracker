import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/analytics", label: "Analytics" },
  { to: "/reminders", label: "Reminders" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full md:w-56 md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-row md:flex-col md:h-screen md:sticky md:top-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-900">Job Tracker</p>
      </div>

      <nav className="flex-1 flex md:block overflow-x-auto md:overflow-visible px-2 py-2 md:py-4 gap-1 md:gap-0 md:space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}