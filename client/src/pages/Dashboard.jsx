import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ExpenseCard from '../components/ExpenseCard';
import { AuthContext } from '../context/AuthContext';
import { getGroupExpenses, getBalances, getUserGroups } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First get user's groups, then fetch expenses and balances for each group
        const groupsRes = await getUserGroups();
        const groups = groupsRes.data.groups;

        if (groups.length === 0) {
          setExpenses([]);
          setBalances([]);
          return;
        }

        // Fetch expenses and balances for all groups
        const allExpenses = [];
        const allBalances = [];

        for (const group of groups) {
          try {
            const [expenseRes, balanceRes] = await Promise.all([
              getGroupExpenses(group._id),
              getBalances(group._id)
            ]);
            allExpenses.push(...expenseRes.data.expenses);
            allBalances.push(...balanceRes.data.balances);
          } catch (err) {
            console.error(`Error fetching data for group ${group._id}:`, err);
          }
        }

        setExpenses(allExpenses.slice(0, 5)); // Limit to 5 recent
        setBalances(allBalances);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const youOwe = balances.find((b) => b.user._id === user?.id && b.amount < 0)?.amount || 0;
  const youAreOwed = balances.find((b) => b.user._id === user?.id && b.amount > 0)?.amount || 0;

  // Chart data
  const categories = ['Food', 'Transport', 'Accommodation', 'Other'];
  const categoryTotals = categories.map(
    (cat) => expenses.filter((exp) => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  );
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: categoryTotals,
        backgroundColor: '#2563EB',
        borderColor: '#1E40AF',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-danger dark:text-red-400 text-center mb-4"
          >
            {error}
          </motion.p>
        )}
        {loading ? (
          <p className="text-center text-text dark:text-gray-200">Loading...</p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-text dark:text-gray-200">Total Spent</h3>
                <p className="text-2xl text-primary dark:text-blue-300">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-text dark:text-gray-200">You Owe</h3>
                <p className="text-2xl text-danger dark:text-red-400">{formatCurrency(Math.abs(youOwe))}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-text dark:text-gray-200">You Are Owed</h3>
                <p className="text-2xl text-accent dark:text-green-400">{formatCurrency(youAreOwed)}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6"
            >
              <h3 className="text-lg font-semibold text-primary dark:text-blue-300 mb-4">
                Expenses by Category
              </h3>
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#1F2937' } } } }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-primary dark:text-blue-300 mb-4">
                Recent Expenses
              </h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {expenses.length ? (
                  expenses.map((exp) => <ExpenseCard key={exp._id} expense={exp} />)
                ) : (
                  <p className="text-text dark:text-gray-200">No recent expenses</p>
                )}
              </div>
            </motion.div>
          </>
        )}
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