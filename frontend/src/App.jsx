import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FormProvider } from "./components/formcontext.jsx";

// Layouts
import SuperAdminLayout from "./layouts/superAdminLayout.jsx";
import CityAdminLayout from "./layouts/cityAdminLayout.jsx";
import BarangayCapLayout from "./layouts/brgyCapLayout.jsx";
import BarangayOffLayout from "./layouts/brgyOffLayout.jsx";
import ComplainantHomeLayout from "./layouts/complainantHomeLayout.jsx";
import ComplainantLayout from "./layouts/complainantLayout.jsx";

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

//Import complainant pages
import CU_HomePage from "./pages/complainant/homepage.jsx";
import CU_TrackComplaintPage from "./pages/complainant/trackComplaint/trackcomplaintpage.jsx";
import CU_ComplainantInfoPage from "./pages/complainant/createComplaint/complainantinfo.jsx";
import CU_ComplaintDetailsPage from "./pages/complainant/createComplaint/complaintdetails.jsx";
import CU_ComplaintSummaryPage from "./pages/complainant/createComplaint/complaintsummary.jsx";
import CU_CompletionMessagePage from "./pages/complainant/createComplaint/completionmessage.jsx";

function App() {
  // usertypes: null, 'superadmin', 'cityadmin', 'brgycap', 'brgyoff'
  const [userRole, setUserRole] = useState(null); // <-- change rani

  // if loggedin
  const isLoggedIn = () => userRole !== null;

  // redirect based on user role if logged or not
  const RedirectPage = () => {
    return isLoggedIn() 
      ? <Navigate to={`/${userRole}/dashboard`} replace />
      : <Navigate to="/home" replace />;
  };

  return (
    <BrowserRouter>
        <FormProvider>
          <Routes>
            {/* Home route (Default) */}
            <Route path="/" element={<ComplainantHomeLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<CU_HomePage />} />
            </Route>
            {/* Complainant Route */}
            <Route path="/file-complaint" element={<Navigate to="/file-complaint/complainantinfo" replace />} />
            <Route element={<ComplainantLayout />}>
              <Route path="/file-complaint/complainantinfo" element={<CU_ComplainantInfoPage />} />
              <Route path="/file-complaint/complaintdetails" element={<CU_ComplaintDetailsPage />} />
              <Route path="/file-complaint/summary" element={<CU_ComplaintSummaryPage />} />
              <Route path="/file-complaint/completionmessage" element={<CU_CompletionMessagePage />} />
              <Route path="/track-complaint" element={<CU_TrackComplaintPage />} />
            </Route>
        
            {/* SuperAdmin Routes */}
            <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="barangays" element={<BarangaysPage />} />
              <Route path="officials" element={<OfficialsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              {/* invalid routes */}
              <Route path="*" element={
                userRole === 'superadmin'
                  ? <Navigate to="/superadmin/dashboard" replace />
                  : <Navigate to="/home" replace />
              } />
            </Route>
            {/* CityAdmin Routes */}
            <Route path="/cityadmin" element={<CityAdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CA_DashboardPage />} />
              <Route path="complaints" element={<CA_ComplaintsPage />} />
              <Route path="barangays" element={<CA_BarangaysPage />} />
              <Route path="officials" element={<CA_OfficialsPage />} />
              <Route path="reports" element={<CA_ReportsPage />} />
              {/* invalid routes */}
              <Route path="*" element={
                userRole === 'cityadmin'
                  ? <Navigate to="/cityadmin/dashboard" replace />
                  : <Navigate to="/home" replace />
              } />
            </Route>
            {/* Barangay Captain Routes */}
            <Route path="/brgycap" element={<BarangayCapLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<BC_DashboardPage />} />
              <Route path="complaints" element={<BC_ComplaintsPage />} />
              <Route path="officials" element={<BC_OfficialsPage />} />
              <Route path="reports" element={<BC_ReportsPage />} />
              <Route path="account" element={<BC_AccountPage />} />
              {/* invalid routes */}
              <Route path="*" element={
                userRole === 'brgycap'
                  ? <Navigate to="/brgycap/dashboard" replace />
                  : <Navigate to="/home" replace />
              } />
            </Route>
            {/* Barangay Official Routes */}
            <Route path="/brgyoff" element={<BarangayOffLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<BO_DashboardPage />} />
              <Route path="assigned-complaints" element={<BO_AssignedComplaintsPage />} />
              <Route path="barangays" element={<BO_BarangaysPage />} />
              <Route path="account" element={<BO_AccountPage />} />
              {/* invalid routes */}
              <Route path="*" element={
                userRole === 'brgyoff'
                  ? <Navigate to="/brgyoff/dashboard" replace />
                  : <Navigate to="/home" replace />
              } />
            </Route>
            {/* other invalid routes*/}
            <Route path="*" element={<RedirectPage />} />
          </Routes>
        </FormProvider>
    </BrowserRouter>
  );
}

export default App;