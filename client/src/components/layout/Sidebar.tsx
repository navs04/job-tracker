import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, Kanban, BarChart3, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reminders", label: "Reminders", icon: Bell },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full md:w-60 md:shrink-0 bg-surface flex flex-row md:flex-col md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-border">
      <div className="px-5 py-5 flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <Briefcase size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <p className="font-semibold text-sm text-ink tracking-tight">Job Tracker</p>
      </div>

      <nav className="flex-1 flex md:flex-col overflow-x-auto md:overflow-visible px-3 py-1 md:py-2 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? "bg-accent-bg text-accent"
                    : "text-muted hover:text-ink hover:bg-canvas"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border hidden md:block">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md">
          <div className="w-7 h-7 rounded-full bg-accent-bg flex items-center justify-center text-xs font-semibold text-accent shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">{user?.name}</p>
            <p className="text-xs text-faint truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-md text-sm text-muted hover:text-ink hover:bg-canvas transition-colors duration-150 w-full"
        >
          <LogOut size={16} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}