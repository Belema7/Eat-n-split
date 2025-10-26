import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-primary dark:text-blue-300">Eat-n-Split</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="ml-2 text-text dark:text-gray-200 hidden sm:inline">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <span className="text-lg">{document.documentElement.classList.contains('dark') ? '☀️' : '🌙'}</span>
        </button>
        <button
          onClick={logout}
          className="bg-danger text-white px-3 py-1 rounded-md hover:bg-red-600 transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}