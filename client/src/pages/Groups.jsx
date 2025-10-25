import React from "react";
import GroupCard from "../components/GroupCard";

const dummyGroups = [
  { _id: "1", name: "Roommates", members: ["Nahom", "Abel", "Sara"] },
  { _id: "2", name: "Class Project", members: ["Team A", "Team B"] },
];

export default function Groups() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">Groups</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {dummyGroups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>
    </div>
  );
}
