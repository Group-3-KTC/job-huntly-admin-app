import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, setAuthInitialized } from "../store/authSlice.ts";
import { useCheckAuthQuery } from "../services/authApi.ts";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuthInitializer = () => {
  const dispatch = useDispatch();
  const { data: authData, error } = useCheckAuthQuery();

  useEffect(() => {
    console.log("useAuthInitializer chạy");

    // Nếu có phản hồi từ API /auth/me, sử dụng thông tin đó
    if (authData?.user) {
      console.log("Đã xác thực qua API /auth/me");
      dispatch(
        loginSuccess({
          user: authData.user,
        })
      );
    } else {
      // Nếu không có phản hồi từ API, kiểm tra thông tin đã lưu
      const userDataFromLocal = localStorage.getItem("admin_user");
      const userDataFromSession = sessionStorage.getItem("admin_user");
      const userData = userDataFromLocal || userDataFromSession;

      if (userData) {
        console.log("Sử dụng thông tin user đã lưu");
        try {
          const user: StoredUser = JSON.parse(userData);
          dispatch(
            loginSuccess({
              user,
            })
          );
        } catch (error) {
          console.warn("Không thể parse user từ storage:", error);
        }
      } else if (error) {
        console.log("Không có thông tin xác thực:", error);
      }
    }

    dispatch(setAuthInitialized());
  }, [dispatch, authData, error]);
};
