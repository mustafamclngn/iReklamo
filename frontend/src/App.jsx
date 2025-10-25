import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "./layouts/superAdminLayout.jsx";
import CityAdminLayout from "./layouts/cityAdminLayout.jsx";
import BarangayCapLayout from "./layouts/brgyCapLayout.jsx";
import BarangayOffLayout from "./layouts/brgyOffLayout.jsx";

// Import superadmin pages
import DashboardPage from "./pages/superAdmin/dashboardpage.jsx";
import ComplaintsPage from "./pages/superAdmin/complaintspage.jsx";
import BarangaysPage from "./pages/superAdmin/barangayspage.jsx";
import OfficialsPage from "./pages/superAdmin/officialspage.jsx";
import ReportsPage from "./pages/superAdmin/reportspage.jsx";

// Import city admin pages
import CA_DashboardPage from "./pages/cityAdmin/dashboardpage.jsx";
import CA_ComplaintsPage from "./pages/cityAdmin/complaintspage.jsx";
import CA_BarangaysPage from "./pages/cityAdmin/barangayspage.jsx";
import CA_OfficialsPage from "./pages/cityAdmin/officialspage.jsx";
import CA_ReportsPage from "./pages/cityAdmin/reportspage.jsx";

// Import barangay captain pages
import BC_DashboardPage from "./pages/brgyCap/dashboardpage.jsx";
import BC_ComplaintsPage from "./pages/brgyCap/complaintspage.jsx";
import BC_OfficialsPage from "./pages/brgyCap/officialspage.jsx";
import BC_ReportsPage from "./pages/brgyCap/reportspage.jsx";
import BC_AccountPage from "./pages/brgyCap/accountpage.jsx";

// Import barangay official pages
import BO_DashboardPage from "./pages/brgyOff/dashboardpage.jsx";
import BO_AssignedComplaintsPage from "./pages/brgyOff/assignedcomplaintspage.jsx";
import BO_BarangaysPage from "./pages/brgyOff/barangayspage.jsx";
import BO_AccountPage from "./pages/brgyOff/accountpage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/superadmin/dashboard" replace />} />
        
        {/* SuperAdmin Routes */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="barangays" element={<BarangaysPage />} />
          <Route path="officials" element={<OfficialsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* CityAdmin Routes */}
        <Route path="/cityadmin" element={<CityAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CA_DashboardPage />} />
          <Route path="complaints" element={<CA_ComplaintsPage />} />
          <Route path="barangays" element={<CA_BarangaysPage />} />
          <Route path="officials" element={<CA_OfficialsPage />} />
          <Route path="reports" element={<CA_ReportsPage />} />
        </Route>

        {/* Barangay Captain Routes */}
        <Route path="/brgycap" element={<BarangayCapLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BC_DashboardPage />} />
          <Route path="complaints" element={<BC_ComplaintsPage />} />
          <Route path="officials" element={<BC_OfficialsPage />} />
          <Route path="reports" element={<BC_ReportsPage />} />
          <Route path="account" element={<BC_AccountPage />} />
        </Route>

        {/* Barangay Official Routes */}
        <Route path="/brgyoff" element={<BarangayOffLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BO_DashboardPage />} />
          <Route path="assigned-complaints" element={<BO_AssignedComplaintsPage />} />
          <Route path="barangays" element={<BO_BarangaysPage />} />
          <Route path="account" element={<BO_AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;