import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/pageSlice.ts";

const routeTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/candidateList": "Candidate List",
  "/companyList": "Company List",
  "/listReport": "Report List",
  "/jobList": "Job List"
};

export const PageTracker = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const title = routeTitleMap[location.pathname] || "Trang chủ";
    dispatch(setPageTitle(title));
  }, [location.pathname, dispatch]);

  return null;
}