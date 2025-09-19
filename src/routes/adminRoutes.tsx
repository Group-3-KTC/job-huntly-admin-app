import { Navigate, Route } from "react-router-dom";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CompanyList from "../features/companylist/pages/CompanyList";
import ReportList from "../features/reportlist/pages/ReportList";
import { CandidateListPage } from "../features/candidatelist/pages/CandidateListPage";
import { RecruiterListPage } from "../features/recruiterlist/pages/RecruiterListPage";
import JobListPage from "../features/jobpostlist/pages/JobListPage";
import Error404 from "../pages/error/Error404";
import MailInboxPage from "../features/mail/pages/MailInboxPage.tsx";
import CvTemplateList from "../features/manageCv/pages/CvTemplateList.tsx";
import CvTemplateDetail from "../features/manageCv/components/CvTemplateDetail.tsx";
import CvTemplateFormPage from "../features/manageCv/components/CvTemplateFormPage.tsx";

const AdminRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="listReport" element={<ReportList />} />
    <Route path="companyList" element={<CompanyList />} />
    <Route path="candidateList" element={<CandidateListPage />} />
    <Route path="recruiterList" element={<RecruiterListPage />} />
    <Route path="jobList" element={<JobListPage />} />
    <Route path="mail" element={<MailInboxPage />} />
    <Route path="manageCv" element={<CvTemplateList />} />
    <Route path="manageCv/:id" element={<CvTemplateDetail />} />
    <Route path="manageCv/create" element={<CvTemplateFormPage />} />
    <Route path="manageCv/:id/edit" element={<CvTemplateFormPage />} />

    <Route path="*" element={<Error404 />} />
  </>
);

export default AdminRoutes;
