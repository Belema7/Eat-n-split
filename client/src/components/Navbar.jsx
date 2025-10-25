import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-teal-400">Eat-n-Split</h1>
      <button className="text-sm bg-teal-500 px-3 py-1 rounded-md hover:bg-teal-600">
        Logout
      </button>
    </nav>
  );
}
