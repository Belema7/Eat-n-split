import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ExpenseCard({ expense }) {
  const { user } = useContext(AuthContext);

  // Find user's split amount
  const userSplit = expense.splits.find((split) => split.user.toString() === user?.id)?.amount || 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600">
      <h3 className="text-lg font-semibold text-primary dark:text-blue-300">{expense.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Paid by: {expense.paidBy?.name || 'Unknown'} | Category: {expense.category || 'Other'}
      </p>
      <p className="text-md font-bold text-text dark:text-gray-200 mt-2">
        {formatCurrency(expense.amount)}
      </p>
      <p className="text-sm text-accent dark:text-green-400">
        Your share: {formatCurrency(userSplit)}
      </p>
    </div>
  );
}