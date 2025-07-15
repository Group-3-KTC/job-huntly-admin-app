export const isAuthenticated = () => {
  return localStorage.getItem("admin_token") !== null;
};
