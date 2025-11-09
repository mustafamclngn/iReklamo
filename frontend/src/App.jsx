import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SuperAdminLayout from "./layouts/superAdminLayout.jsx";
import CityAdminLayout from "./layouts/cityAdminLayout.jsx";
import BarangayCapLayout from "./layouts/brgyCapLayout.jsx";
import BarangayOffLayout from "./layouts/brgyOffLayout.jsx";
import ComplainantHomeLayout from "./layouts/complainantHomeLayout.jsx";
import ComplainantLayout from "./layouts/complainantLayout.jsx";
import AuthLayout from "./layouts/authLayout.jsx";
import RedirectFallback from "./utils/Redirect.jsx";

// Import Authentication Pages
import LoginPage from "./pages/auth/logInPage.jsx";
import RequireAuth from "./pages/auth/RequireAuth.jsx";
import PersistLogin from "./pages/auth/PersistLogin.jsx";

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

// Import complainant pages
import CU_HomePage from "./pages/complainant/homepage.jsx";
import CU_FileComplaintPage from "./pages/complainant/createComplaint/filecomplaintpage.jsx";
import CU_TrackComplaintPage from "./pages/complainant/trackComplaint/trackcomplaintpage.jsx";

// Import shared official detail page
import OfficialDetailsPage from "./pages/shared/OfficialDetailsPage.jsx";

function App() {
  // usertypes: 'user' // null , 'super_admin', 'city_admin', 'brgy_cap', 'brgy_off'
  const location = useLocation();

    return (
    <Routes>
        {/* Home route (Default) */}
        <Route path="/" element={<ComplainantHomeLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<CU_HomePage />} />
        </Route>

        {/* Complainant Route */}
        <Route element={<ComplainantLayout />}>
          <Route path="/file-complaint" element={<CU_FileComplaintPage />} />
          <Route path="/track-complaint" element={<CU_TrackComplaintPage />} />
        </Route>
        
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[1]}/>}>
          {/* SuperAdmin Routes */}
          <Route path="/superadmin" element={<SuperAdminLayout />}> 
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="barangays" element={<BarangaysPage />} />
            <Route path="officials" element={<OfficialsPage />} />
            <Route path="officials/:user_id" element={<OfficialDetailsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            {/* invalid routes */}
            <Route path="*" element={ <Navigate to="/superadmin/dashboard" replace />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[2]}/>}>
          {/* CityAdmin Routes */}
          <Route path="/cityadmin" element={<CityAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CA_DashboardPage />} />
            <Route path="complaints" element={<CA_ComplaintsPage />} />
            <Route path="barangays" element={<CA_BarangaysPage />} />
            <Route path="officials" element={<CA_OfficialsPage />} />
            <Route path="officials/:user_id" element={<OfficialDetailsPage />} />
            <Route path="reports" element={<CA_ReportsPage />} />
            {/* invalid routes */}
            <Route path="*" element={ <Navigate to="/cityadmin/dashboard" replace />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[3]}/>}>
          {/* Barangay Captain Routes */}
          <Route path="/brgycap" element={<BarangayCapLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BC_DashboardPage />} />
            <Route path="complaints" element={<BC_ComplaintsPage />} />
            <Route path="officials" element={<BC_OfficialsPage />} />
            <Route path="officials/:user_id" element={<OfficialDetailsPage />} />
            <Route path="reports" element={<BC_ReportsPage />} />
            <Route path="account" element={<BC_AccountPage />} />
            {/* invalid routes */}
            <Route path="*" element={ <Navigate to="/brgycap/dashboard" replace />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[4]}/>}>
          {/* Barangay Official Routes */}
          <Route path="/brgyoff" element={<BarangayOffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BO_DashboardPage />} />
            <Route path="assigned-complaints" element={<BO_AssignedComplaintsPage />} />
            <Route path="barangays" element={<BO_BarangaysPage />} />
            <Route path="account" element={<BO_AccountPage />} />
            {/* invalid routes */}
            <Route path="*" element={ <Navigate to="/brgyoff/dashboard" replace />} />
          </Route>
        </Route>
      </Route>
      
      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
      
      {/* other invalid routes*/}
      <Route path="*" element={<RedirectFallback />} />
    </Routes>
  );
}

export default App;