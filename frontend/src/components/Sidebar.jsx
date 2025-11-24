import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/users", label: "Users" },
  { to: "/templates", label: "Templates" },
  { to: "/workflows", label: "Workflows" },
  { to: "/conversations", label: "Conversations" },
  { to: "/send", label: "Send Notification" },
  { to: "/workflow-instances", label: "Workflow Instances" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-8">AI Command Centre</h1>

      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded-md ${
              location.pathname === link.to
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
