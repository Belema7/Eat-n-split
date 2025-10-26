import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ExpenseCard from '../components/ExpenseCard';
import { NavLink } from 'react-router-dom';
import { getGroup, getGroupExpenses, getBalances, addExpense } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Other',
    splitType: 'equal',
    membersInvolved: [],
  });
  const [activeTab, setActiveTab] = useState('expenses');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupRes, expenseRes, balanceRes] = await Promise.all([
          getGroup(id),
          getGroupExpenses(id),
          getBalances(id),
        ]);
        setGroup(groupRes.data.group);
        setExpenses(expenseRes.data.expenses);
        setBalances(balanceRes.data.balances);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load group data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.membersInvolved.length) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await addExpense({ ...formData, group: id });
      setExpenses([...expenses, res.data.expense]);
      setFormData({ name: '', amount: '', category: 'Other', splitType: 'equal', membersInvolved: [] });
      setIsFormOpen(false);
      // Refresh balances
      const balanceRes = await getBalances(id);
      setBalances(balanceRes.data.balances);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-text dark:text-gray-200">Loading...</p>;
  if (!group) return <p className="text-center text-danger dark:text-red-400">{error || 'Group not found'}</p>;

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
            <h2 className="text-2xl font-bold text-primary dark:text-blue-300">{group.name}</h2>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              {isFormOpen ? 'Cancel' : 'Add Expense'}
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
              <div className="grid gap-4">
                <div>
                  <label className="block text-text dark:text-gray-200 mb-2">Expense Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter expense name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-text dark:text-gray-200 mb-2">Amount</label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-text dark:text-gray-200 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  >
                    {['Food', 'Transport', 'Accommodation', 'Other'].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-text dark:text-gray-200 mb-2">Split Type</label>
                  <select
                    name="splitType"
                    value={formData.splitType}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  >
                    <option value="equal">Equal</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </motion.button>
            </motion.form>
          )}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-md ${activeTab === 'expenses'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-text dark:text-gray-200'
                }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`px-4 py-2 rounded-md ${activeTab === 'balances'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-text dark:text-gray-200'
                }`}
            >
              Balances
            </button>
          </div>
          {activeTab === 'expenses' ? (
            expenses.length ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {expenses.map((exp) => (
                  <ExpenseCard key={exp._id} expense={exp} />
                ))}
              </div>
            ) : (
              <p className="text-center text-text dark:text-gray-200">No expenses found</p>
            )
          ) : (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-primary dark:text-blue-300 mb-4">
                Balances
              </h3>
              {balances.length ? (
                <ul className="space-y-2">
                  {balances.map((balance) => (
                    <li
                      key={balance.user._id}
                      className="flex justify-between text-text dark:text-gray-200"
                    >
                      <span>{balance.user.name}</span>
                      <span
                        className={
                          balance.amount >= 0 ? 'text-accent dark:text-green-400' : 'text-danger dark:text-red-400'
                        }
                      >
                        {formatCurrency(balance.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text dark:text-gray-200">No balances to display</p>
              )}
            </div>
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



