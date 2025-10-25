import React from "react";

export default function Profile() {
  const user = { name: "Nahom", email: "nahom@example.com" }; // later replace with context or API

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p className="mt-2"><strong>Email:</strong> {user.email}</p>
      <button className="mt-4 bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-600">
        Edit Profile
      </button>
    </div>
  );
}
