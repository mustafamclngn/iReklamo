import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useComplaintsApi from "../../../api/complaintsAPI";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorAlert from "../../../components/common/ErrorAlert";
import HeroBanner from "../../../components/navheaders/heroBanner";

const statusColors = {
  Pending: "#FFB300",
  "In-Progress": "#FFD600",
  Resolved: "#43B174",
  Rejected: "#DC3545",
};

const CU_TrackComplaintDetailsPage = () => {
  const { complaintCode } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { trackComplaint } = useComplaintsApi();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const response = await trackComplaint(complaintCode);

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

  const currentStatus = complaint?.status || "Pending";
  const isRejected = currentStatus === "Rejected";

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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="bi bi-file-earmark-text-fill text-blue-600 text-2xl"></i>
              </div>
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
              <span
                className="inline-block px-4 py-1.5 rounded-full font-semibold text-white text-sm"
                style={{ backgroundColor: statusColors[currentStatus] }}
              >
                {currentStatus}
              </span>
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
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="bi bi-geo-alt-fill text-red-600 text-2xl"></i>
              </div>
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

        {/* gicombine status history og line */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="bi bi-clock-history text-green-600 text-2xl"></i>
              </div>
              Status Tracking
            </h2>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          {/* progress bar*/}
          <div className="relative pt-4 px-8 pb-12 mb-8 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-start mb-2 relative">
              <div
                className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full"
                style={{ zIndex: 0 }}
              ></div>

              {/* progress line */}
              <div
                className="absolute top-6 left-0 h-2 transition-all duration-500 rounded-full"
                style={{
                  width: isRejected
                    ? "0%"
                    : currentStatus === "Pending"
                    ? "18%"
                    : currentStatus === "In-Progress"
                    ? "50%"
                    : currentStatus === "Resolved"
                    ? "100%"
                    : "0%",
                  backgroundColor: isRejected ? "#DC3545" : "#43B174",
                  zIndex: 1,
                }}
              ></div>

              {/* if submitted */}
              <div
                className="text-center flex-1 relative"
                style={{ zIndex: 2 }}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold shadow-lg ${
                    !isRejected
                      ? "bg-green-500 text-white ring-4 ring-green-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <i className="bi bi-check-lg text-2xl"></i>
                </div>
                <p className="text-base font-bold text-gray-800 mt-3">
                  Submitted
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(complaint?.created_at)}
                </p>
              </div>

              {/* if in progress*/}
              <div
                className="text-center flex-1 relative"
                style={{ zIndex: 2 }}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold shadow-lg ${
                    !isRejected &&
                    (currentStatus === "In-Progress" ||
                      currentStatus === "Resolved")
                      ? "bg-green-500 text-white ring-4 ring-green-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {!isRejected &&
                  (currentStatus === "In-Progress" ||
                    currentStatus === "Resolved") ? (
                    <i className="bi bi-check-lg text-2xl"></i>
                  ) : (
                    <span className="text-sm">2</span>
                  )}
                </div>
                <p className="text-base font-bold text-gray-800 mt-3">
                  In-Progress
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {!isRejected &&
                  (currentStatus === "In-Progress" ||
                    currentStatus === "Resolved")
                    ? formatDate(complaint?.updated_at || complaint?.created_at)
                    : "Pending"}
                </p>
              </div>

              {/* if resolved */}
              <div
                className="text-center flex-1 relative"
                style={{ zIndex: 2 }}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold shadow-lg ${
                    currentStatus === "Resolved"
                      ? "bg-green-500 text-white ring-4 ring-green-100"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStatus === "Resolved" ? (
                    <i className="bi bi-check-lg text-2xl"></i>
                  ) : (
                    <span className="text-sm">3</span>
                  )}
                </div>
                <p className="text-base font-bold text-gray-800 mt-3">
                  Resolved
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentStatus === "Resolved"
                    ? formatDate(
                        complaint?.resolved_at || complaint?.updated_at
                      )
                    : "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* status history */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status History
            </h3>
            {complaint?.status_history &&
            complaint.status_history.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {complaint.status_history.map((entry, index) => (
                  <div key={index} className="relative pl-8 pb-4 last:pb-0">
                    {index !== complaint.status_history.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            statusColors[entry.status] || "#AEAEAE",
                        }}
                      >
                        <i className="bi bi-circle-fill text-white text-xs"></i>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-3 py-0.5 rounded-full font-semibold text-white text-xs"
                          style={{
                            backgroundColor:
                              statusColors[entry.status] || "#AEAEAE",
                          }}
                        >
                          {entry.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.changed_at
                            ? formatDate(entry.changed_at)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {entry.remarks || "No remarks provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <i className="bi bi-info-circle text-3xl mb-2 block"></i>
                <p className="text-sm">No status updates recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Rejection Reason Section */}
        {isRejected && (
          <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <i className="bi bi-x-circle-fill text-red-600"></i>
                Rejection Details
              </h2>
            </div>
            <hr className="border-t border-gray-200 mt-4 mb-6" />

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <label className="block text-md text-gray-600 mb-2">
                    Reason for Rejection:
                  </label>
                  <p className="text-gray-900 font-medium text-base leading-relaxed">
                    {complaint.rejection_reason || "No reason provided"}
                  </p>
                </div>
                {complaint.rejected_at && (
                  <div>
                    <label className="block text-md text-gray-600 mb-2">
                      Rejected On:
                    </label>
                    <p className="text-gray-900 font-medium text-base">
                      {formatDate(complaint.rejected_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* footer */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
          <div className="flex items-start gap-3">
            <i className="bi bi-megaphone-fill text-2xl text-red-600"></i>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Need Help?
              </h3>
              <p className="text-gray-600 text-base">
                For questions about your complaint, please don't hesitate to
                contact your barangay office or the assigned official, or reach
                us through our official email:
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
