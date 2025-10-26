import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GroupCard from '../components/GroupCard';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../services/api';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        setProfile(res.data.user);
        setFormData({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // Placeholder: Implement /api/auth/update-profile endpoint
      // await updateProfile(formData);
      setProfile({ ...profile, name: formData.name, email: formData.email });
      setUser({ ...user, name: formData.name, email: formData.email });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-text dark:text-gray-200">Loading...</p>;
  if (!profile) return <p className="text-center text-danger dark:text-red-400">{error || 'Profile not found'}</p>;

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-primary dark:text-blue-300 mb-4">Profile</h2>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger dark:text-red-400 text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          {isEditing ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            >
              <div className="mb-4">
                <label className="block text-text dark:text-gray-200 mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-text dark:text-gray-200 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-text dark:text-gray-200 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <p className="text-text dark:text-gray-200">
                <strong>Name:</strong> {profile.name}
              </p>
              <p className="mt-2 text-text dark:text-gray-200">
                <strong>Email:</strong> {profile.email}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </motion.button>
            </div>
          )}
          <h3 className="text-lg font-semibold text-primary dark:text-blue-300 mt-6 mb-4">
            Your Groups
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {profile.groups?.length ? (
              profile.groups.map((group) => <GroupCard key={group._id} group={group} />)
            ) : (
              <p className="text-text dark:text-gray-200">No groups joined</p>
            )}
          </div>
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