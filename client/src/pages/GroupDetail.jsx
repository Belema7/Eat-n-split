import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExpenseCard from "../components/ExpenseCard";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    // later, fetch from API:
    setGroup({
      name: "Roommates",
      expenses: [
        { id: 1, title: "Groceries", paidBy: "Nahom", amount: 500 },
        { id: 2, title: "Dinner", paidBy: "Sara", amount: 200 },
      ],
    });
  }, [id]);

  if (!group) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">{group.name}</h2>
      <div className="grid gap-4">
        {group.expenses.map((exp) => (
          <ExpenseCard key={exp.id} expense={exp} />
        ))}
      </div>
    </div>
  );
}
