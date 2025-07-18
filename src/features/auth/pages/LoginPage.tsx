import { useLoginMutation } from "../services/mockAuthApi.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { type LoginForm, loginSchema } from "../schemas/loginSchema.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice.ts";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data).unwrap();
      localStorage.setItem("admin_token", res.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(res.user));
      dispatch(loginSuccess({ user: res.user, token: res.accessToken }));
      navigate("/dashboard");
    } catch (err) {
      setApiError("Error: " + err);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3B82F6]/10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-30 text-center">
          <div className="mx-auto loader border-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Đang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3B82F6]/10 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-2xl">
        <h2 className="mb-2 text-2xl font-semibold text-center">
          Login to Account
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500">
          Please enter your email and password to sign in
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="email">
              Email address:
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              className="w-full px-4 py-2 bg-gray-100 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block mb-1 text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="123456"
                className="w-full px-4 py-2 pr-10 bg-gray-100 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            Sign In
          </button>

          {apiError && (
            <p className="mt-2 text-sm text-center text-red-500">{apiError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
