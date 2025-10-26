import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/groups', label: 'Groups' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md hidden md:block">
      <h1 className="text-2xl font-bold text-primary dark:text-blue-300 mb-6">Eat-n-Split</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block p-2 rounded-md text-text dark:text-gray-200 transition ${
                isActive
                  ? 'bg-primary text-white dark:bg-blue-600'
                  : 'hover:bg-blue-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}