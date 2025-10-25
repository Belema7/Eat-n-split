import React from "react";
import ExpenseCard from "../components/ExpenseCard";

const dummyExpenses = [
  { id: 1, title: "Pizza Night", paidBy: "Nahom", amount: 320 },
  { id: 2, title: "Taxi", paidBy: "Sara", amount: 120 },
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">
        Recent Expenses
      </h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {dummyExpenses.map((exp) => (
          <ExpenseCard key={exp.id} expense={exp} />
        ))}
      </div>
    </div>
  );
}
