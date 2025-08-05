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
      navigate("/admin/dashboard");
    } catch (err) {
      setApiError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 px-10 py-12">
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-4">
          Job Huntly Admin 👋
        </h2>
        <p className="text-center text-blue-500 mb-8">
          Please enter your credentials to continue
        </p>

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-blue-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 
                focus:ring-blue-400 placeholder-blue-400 text-blue-900 
                ${errors.email ? "border-red-500" : "border-blue-300"}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm mt-1 text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-blue-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 
                  focus:ring-blue-400 placeholder-blue-400 text-blue-900 
                  ${errors.password ? "border-red-500" : "border-blue-300"}`}
                {...register("password")}
              />
              {/* <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-blue-500 hover:text-blue-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeSlash size={22} /> : <Eye size={22} />}
              </button> */}
            </div>
            {errors.password && (
              <p className="text-sm mt-1 text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Login..." : "Login"}
          </button>

          {apiError && (
            <p className="text-center text-red-600 font-medium mt-4">
              {apiError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

