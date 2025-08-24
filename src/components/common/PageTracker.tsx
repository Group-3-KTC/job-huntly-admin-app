import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/pageSlice.ts";
import { t } from "ttag";
import { useCurrentLanguage } from "../../hooks/useCurrentLanguage.ts";

export const PageTracker = () => {
  const routeTitleMap: Record<string, string> = {
    "/admin/dashboard": t`Dashboard`,
    "/admin/candidateList": t`Candidate List`,
    "/admin/companyList": t`Company List`,
    "/admin/listReport": t`Report List`,
    "/admin/jobList": t`Job List`,
  };

  const location = useLocation();
  const dispatch = useDispatch();

  useCurrentLanguage();

  useEffect(() => {
    const title = routeTitleMap[location.pathname] || "Dashboard";
    dispatch(setPageTitle(title));
  }, [location.pathname, dispatch, routeTitleMap]);

  return null;
};
