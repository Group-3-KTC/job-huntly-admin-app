import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, setAuthInitialized } from "../store/authSlice.ts";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useAuthInitializer chạy");

    const token = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");

    if (token && userData) {
      console.log("có token & user");
      try {
        const user: StoredUser = JSON.parse(userData);
        dispatch(
          loginSuccess({
            token,
            user,
          }),
        );
      } catch (error) {
        console.warn("Không thể parse user từ localStorage:" + error);
      }
    }
    dispatch(setAuthInitialized());
  }, [dispatch]);
};
