import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ username, password, name, phoneNumber, email });
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Signup failed. Please check your details and try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Section - Image */}
      <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
          alt="Library background"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-600/40"></div>
        <div className="absolute text-white text-center px-6">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Join City Library Today
          </h1>
          <p className="text-lg opacity-90">
            Become a member and unlock access to thousands of resources.
          </p>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12 relative">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full shadow-sm border border-gray-300 transition duration-300"
        >
          🏠 Home
        </button>

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create Your Account
          </h2>

          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
