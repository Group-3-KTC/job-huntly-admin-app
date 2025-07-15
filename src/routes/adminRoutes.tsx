import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import CompanyList from '../features/companylist/pages/CompanyList';
import ReportList from '../features/reportlist/pages/ReportList';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/listReport" element={<ReportList />} />
      <Route path="/companyList" element={<CompanyList />} />
      <Route path="/" element={<DashboardPage />} /> {/* Chuyển hướng mặc định đến dashboard */}
    </Routes>
  );
};

export default AdminRoutes;
