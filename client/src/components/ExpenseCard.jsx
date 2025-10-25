import React from "react";
import { formatCurrency } from "../utils/formatCurrency";

export default function ExpenseCard({ expense }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md hover:bg-gray-750 transition">
      <h3 className="text-lg font-semibold text-teal-400">{expense.title}</h3>
      <p className="text-sm text-gray-400 mt-1">
        Paid by: {expense.paidBy}
      </p>
      <p className="text-md font-bold mt-2">
        {formatCurrency(expense.amount)}
      </p>
    </div>
  );
}
