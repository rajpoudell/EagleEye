import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setError("No user found in localStorage!");
      return;
    }

    if (
      formData.email === storedUser.email &&
      formData.password === storedUser.password
    ) {
      setError("");
      toast.success("Login successful!", {
        position: "top-right",
      });
      // Here you can redirect or set logged-in state
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 backdrop-blur-sm bg-white/20 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter your password"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="px-2 py-2 w-full text-center bg-gray-600 text-white rounded-md hover:bg-slate-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
