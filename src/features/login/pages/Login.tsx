import React, { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.email === "admin@gmail.com" && form.password === "123456") {
      localStorage.setItem("admin_token", "dummy_token");
      navigate("/dashboard")
    } else {
      setError("Sai email hoặc password");
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3B82F6]/10 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-2xl">
        <h2 className="mb-2 text-2xl font-semibold text-center">
          Login to Account
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500">
          Please enter your email and password to sign in
        </p>
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email Field */}
          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="email">
              Email address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@gmail.com"
              className="w-full px-4 py-2 bg-gray-100 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block mb-1 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="123456"
                className="w-full px-4 py-2 pr-10 bg-gray-100 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute inset-y-0 flex items-center text-gray-500 cursor-pointer right-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500" />
              Remember Password
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forget Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-center text-red-500">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
