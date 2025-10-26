import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GroupCard from '../components/GroupCard';
import { getUserGroups, createGroup } from '../services/api';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({ name: '', members: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await getUserGroups();
        setGroups(res.data.groups);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Group name is required');
      return;
    }
    setLoading(true);
    try {
      const res = await createGroup(formData);
      setGroups([...groups, res.data.group]);
      setFormData({ name: '', members: [] });
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-blue-300">
              Your Groups
            </h2>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              {isFormOpen ? 'Cancel' : 'Create Group'}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger dark:text-red-400 text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          {isFormOpen && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            >
              <div className="mb-4">
                <label className="block text-text dark:text-gray-200 mb-2">
                  Group Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter group name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Group'}
              </motion.button>
            </motion.form>
          )}
          {loading ? (
            <p className="text-center text-text dark:text-gray-200">Loading...</p>
          ) : groups.length ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text dark:text-gray-200">No groups found</p>
          )}
        </motion.div>
      </div>
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 p-4 shadow-t flex justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-text dark:text-gray-200 ${isActive ? 'text-primary dark:text-blue-300' : ''}`
          }
        >
          🏠 Dashboard
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) =>
            `text-text dark:text-gray-200 ${isActive ? 'text-primary dark:text-blue-300' : ''}`
          }
        >
          👥 Groups
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-text dark:text-gray-200 ${isActive ? 'text-primary dark:text-blue-300' : ''}`
          }
        >
          👤 Profile
        </NavLink>
      </nav>
    </div>
  );
}