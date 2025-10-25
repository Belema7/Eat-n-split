import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-sm mx-auto mt-20 bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-teal-400">
        Login
      </h2>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none" />
        <input type="password" placeholder="Password" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none" />
        <button className="w-full bg-teal-500 py-2 rounded-md hover:bg-teal-600">
          Login
        </button>
      </form>
      <p className="text-sm mt-3 text-gray-400 text-center">
        Don’t have an account? <Link to="/register" className="text-teal-400">Register</Link>
      </p>
    </div>
  );
}
