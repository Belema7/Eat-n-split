import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

export default function GroupCard({ group }) {
  const totalSpent = group.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;

  return (
    <Link
      to={`/groups/${group._id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600"
    >
      <h3 className="text-lg font-semibold text-primary dark:text-blue-300">{group.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Members: {group.members?.length || 0} | Total: {formatCurrency(totalSpent)}
      </p>
    </Link>
  );
}