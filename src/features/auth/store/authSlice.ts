import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { API_CONFIG } from "../../../config/config";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Giữ lại để tương thích với code cũ
  authInitialized: boolean;
}

// Kiểm tra user từ cả localStorage và sessionStorage
const getStoredUser = (): User | null => {
  const userFromLocal = localStorage.getItem("admin_user");
  const userFromSession = sessionStorage.getItem("admin_user");
  const userData = userFromLocal || userFromSession;
  
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (e) {
    console.error("Lỗi parse user data:", e);
    return null;
  }
};

// Cookie được xử lý tự động bởi browser, chỉ cần kiểm tra xem có thông tin user lưu trữ không
const initialState: AuthState = {
  // Đã đăng nhập nếu có thông tin user trong storage
  isAuthenticated: !!getStoredUser(),
  user: getStoredUser(),
  token: "", // Không sử dụng token từ localStorage nữa
  authInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token?: string }>,
    ) => {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      // Không cần lưu token vào state nữa
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true;
    },
      logout: (state) => {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;

          // Xóa thông tin user lưu trữ
          localStorage.removeItem("admin_user");
          sessionStorage.removeItem("admin_user");

          // Gửi POST request đến API logout
          fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Bạn có thể thêm Authorization header nếu cần
                  'Authorization': `Bearer ${state.token}`,
              },
              credentials: 'include',  // Nếu bạn sử dụng cookie (có thể cần nếu đang sử dụng cookie Auth)
          })
              .then(response => {
                  if (response.ok) {
                      console.log("Logout thành công!");
                      // Sau khi logout thành công, bạn có thể chuyển hướng người dùng tới trang đăng nhập hoặc trang chính
                      window.location.href = '/login'; // hoặc trang bạn muốn
                  } else {
                      console.error("Lỗi khi logout!");
                  }
              })
              .catch(error => console.error("Đã xảy ra lỗi khi logout", error));
      },
  },
});

export const { loginSuccess, logout, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
