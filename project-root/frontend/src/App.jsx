import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BrowseStaffPage from './pages/BrowseStaffPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import StaffProfilePage from './pages/StaffProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="staff" element={<BrowseStaffPage />} />
        <Route path="staff/:staffId" element={<StaffProfilePage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}