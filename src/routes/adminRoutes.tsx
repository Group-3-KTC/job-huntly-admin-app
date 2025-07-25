import { Navigate, Route } from "react-router-dom";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CompanyList from "../features/companylist/pages/CompanyList";
import ReportList from "../features/reportlist/pages/ReportList";
import { CandidateListPage } from "../features/candidatelist/pages/CandidateListPage";
import JobListPage from "../features/jobpostlist/pages/JobListPage";
import Error404 from "../features/error/Error404";

const AdminRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="listReport" element={<ReportList />} />
    <Route path="companyList" element={<CompanyList />} />
    <Route path="candidateList" element={<CandidateListPage />} />
    <Route path="jobList" element={<JobListPage />} />
    <Route path="*" element={<Error404 />} />
  </>
);

export default AdminRoutes;
