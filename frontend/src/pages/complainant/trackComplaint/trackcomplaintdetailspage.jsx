import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useComplaintsApi from "../../../api/complaintsAPI";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorAlert from "../../../components/common/ErrorAlert";
import HeroBanner from "../../../components/navheaders/heroBanner";

const CU_TrackComplaintDetailsPage = () => {
  const { complaintCode } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const complaintsApi = useComplaintsApi();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const response = await complaintsApi.trackComplaint(complaintCode);

        if (response.success && response.data) {
          setComplaint(response.data);
        } else {
          setError(response.message || "Complaint not found");
          setTimeout(() => navigate("/track-complaint"), 3000);
        }
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError("Unable to load complaint details");
        setTimeout(() => navigate("/track-complaint"), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (complaintCode) {
      fetchComplaint();
    }
  }, [complaintCode, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading complaint details..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="mb-8 pt-8 px-8">
        <HeroBanner />
      </div>

      <div className="max-w-[1591px] mx-auto px-8 pb-8">
        {/* back button */}
        <button
          onClick={() => navigate("/home")}
          className="w-[337px] h-[45px] bg-white hover:bg-[#E6E6E6] text-black rounded-lg flex items-center justify-center gap-x-3 text-[24px] font-small mb-6 transition-colors"
        >
          <i className="bi bi-arrow-left text-2xl"></i>
          Back to Home
        </button>

        {/* complaint details */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <i className="bi bi-file-earmark-text-fill"></i>
              Complaint Details
            </h2>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">
                Complaint ID:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.complaint_code}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Complaint Title:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.title}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Case Type:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.case_type}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Date Filed:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {formatDate(complaint?.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Assigned Official:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.assigned_official || "Not yet assigned"}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Status:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.status || "Not yet assigned"}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-md text-gray-600 mb-2">
                Description:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.description}
              </p>
            </div>
          </div>
        </div>

        {/* complaint address */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <i className="bi bi-geo-alt-fill text-red-600"></i>
              Complaint Address
            </h2>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">
                Barangay:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.barangay_name || "Barangay not provided"}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">
                Specific Location:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.specific_location || "Not specified"}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-md text-gray-600 mb-2">
                Full Address:
              </label>
              <p className="text-gray-900 font-medium text-lg">
                {complaint?.full_address ||
                  complaint?.address ||
                  "Address not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* complaint status */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <i className="bi bi-file-earmark-text"></i>
              Complaint Status
            </h2>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />
          <div className="relative pt-4 px-8">
            <div className="flex justify-between items-start mb-2 relative">
              <div
                className="absolute top-6 left-0 right-0 h-1 bg-gray-200"
                style={{ zIndex: 0 }}
              ></div>

              {/* progress line */}
              <div
                className="absolute top-6 left-0 h-1 bg-green-500 transition-all duration-500"
                style={{
                  width:
                    complaint?.status === "Pending"
                      ? "18%"
                      : complaint?.status === "In-Progress"
                      ? "50%"
                      : complaint?.status === "Resolved"
                      ? "100%"
                      : "0%",
                  zIndex: 1,
                }}
              ></div>

              {/* if submitted */}
              <div className="text-center flex-1 relative" style={{ zIndex: 2 }}>
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${
                    complaint?.status === "Pending" ||
                    complaint?.status === "In-Progress" ||
                    complaint?.status === "Resolved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  ✓
                </div>
                <p className="text-sm font-bold text-gray-800 mt-3">Submitted</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(complaint?.created_at)}
                </p>
              </div>

              {/* if in progress */}
              <div className="text-center flex-1 relative" style={{ zIndex: 2 }}>
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${
                    complaint?.status === "In-Progress" ||
                    complaint?.status === "Resolved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {complaint?.status === "In-Progress" ||
                  complaint?.status === "Resolved"
                    ? "✓"
                    : ""}
                </div>
                <p className="text-sm font-bold text-gray-800 mt-3">
                  In Progress
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {complaint?.status === "In-Progress" ||
                  complaint?.status === "Resolved"
                    ? formatDate(complaint?.updated_at || complaint?.created_at)
                    : "Pending"}
                </p>
              </div>

              {/* if resolved */}
              <div className="text-center flex-1 relative" style={{ zIndex: 2 }}>
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${
                    complaint?.status === "Resolved"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {complaint?.status === "Resolved" ? "✓" : ""}
                </div>
                <p className="text-sm font-bold text-gray-800 mt-3">Resolved</p>
                <p className="text-xs text-gray-500 mt-1">
                  {complaint?.status === "Resolved"
                    ? formatDate(complaint?.resolved_at || complaint?.updated_at)
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mt-6">
          <div className="flex items-start gap-3">
            <i className="bi bi-megaphone-fill text-2xl text-red-600"></i>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Need Help?
              </h3>
              <p className="text-gray-600 text-base">
                For questions about your complaint, please don't hesitate to contact your barangay office or the assigned official, or reach us through our official email:
                <span className="text-blue-600"> IliganReklamo@email.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CU_TrackComplaintDetailsPage;