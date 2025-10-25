import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/groups", label: "Groups" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <aside className="w-56 bg-gray-800 text-gray-100 p-4">
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="block p-2 rounded-md hover:bg-gray-700 transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
