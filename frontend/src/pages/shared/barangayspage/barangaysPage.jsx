import React, { useState, useEffect } from "react";
import { Users, X, MapPin, Phone, Mail } from "lucide-react";
import ErrorAlert from "../../../components/common/ErrorAlert";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import BarangayCard from "../../../components/cards/BarangayCard";
import barangaysApi from "../../../api/barangaysApi";
import { barangayFullData } from "../../../api/barangayInfoData";
import DirectoryLayout from "./directoryLayout";

const BarangaysPage = () => {
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  useEffect(() => {
    fetchBarangays();
  }, []);

  useEffect(() => {
    if (selectedBarangay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBarangay]);

  const fetchBarangays = async () => {
    try {
      setLoading(true);
      const response = await barangaysApi.getBarangaysDetails();

      const barangaysWithCompleteData = response.data.map((barangay) => {
        const censusData = barangayFullData[barangay.barangay_name];

        return {
          ...barangay,
          barangayCensus: censusData?.population || 0,
          barangayAddress: censusData?.address || "Address not available",
          barangayLocation:
            censusData?.specificLocation || "Location details not available",
        };
      });

      setBarangays(barangaysWithCompleteData);
      setError(null);
    } catch (err) {
      console.error("Error fetching barangays:", err);
      setError("Failed to load barangays. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (barangay) => {
    setSelectedBarangay(barangay);
  };

  const closeModal = () => {
    setSelectedBarangay(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading barangays..." />;
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchBarangays} />;
  }

  return (
    <DirectoryLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {barangays.map((barangay) => (
          <BarangayCard
            key={barangay.id}
            barangay={barangay}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {barangays.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No barangays found</p>
        </div>
      )}

      {/* modal */}
      {selectedBarangay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-black mb-1">
                    Barangay {selectedBarangay.barangay_name}
                  </h2>
                  <p className="text-sm text-black">
                    View information and details
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* main content */}
            <div className="p-6 space-y-4">
              <div className="bg-white rounded-lg p-4 border border-grey-200">
                <div className="flex items-start">
                  <div className="text-black mt-1 mr-3">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Barangay Captain
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBarangay.captain_name || "No Captain Assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* contact */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-black mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-0.5">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBarangay.captain_contact ||
                          "No contact number yet"}
                      </p>
                    </div>
                  </div>
                  {selectedBarangay.captain_email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-black mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-black mb-0.5">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {selectedBarangay.captain_email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* location */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-black mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-0.5">
                        Barangay Hall Address
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBarangay.barangayAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-black mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black mb-0.5">
                        Specific Location
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBarangay.barangayLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* population */}
              <div className="bg-white rounded-lg p-4 border border-grey-200">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-black mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Population Count
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {selectedBarangay.barangayCensus?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-black mt-1">As of 2024 Census</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DirectoryLayout>
  );
};

export default BarangaysPage;
