import React from "react";
import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group._id}`}
      className="block bg-gray-800 p-4 rounded-xl hover:bg-gray-750 shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-teal-400">{group.name}</h3>
      <p className="text-gray-400 text-sm mt-1">
        Members: {group.members.length}
      </p>
    </Link>
  );
}
