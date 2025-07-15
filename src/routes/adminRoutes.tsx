import { Route, Routes } from "react-router-dom";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CompanyList from "../features/companylist/pages/CompanyList";
import ReportList from "../features/reportlist/pages/ReportList";
import { CandidateListPage } from "../features/candidatelist/pages/CandidateListPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/listReport" element={<ReportList />} />
      <Route path="/companyList" element={<CompanyList />} />
      <Route path="/candidateList" element={<CandidateListPage />} />
    </Routes>
  );
};

export default AdminRoutes;
