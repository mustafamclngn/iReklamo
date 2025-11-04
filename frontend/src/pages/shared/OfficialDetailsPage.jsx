import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import officialsApi from '../../api/officialsApi';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const OfficialDetailsPage = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [official, setOfficial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const hasValidImage = official?.profile_picture && !imageError;

  useEffect(() => {
    fetchOfficialDetails();
  }, [user_id]);

  const fetchOfficialDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await officialsApi.getOfficialById(user_id);
      
      if (response.success) {
        setOfficial(response.data);
      } else {
        setError('Failed to fetch official details');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Error fetching official details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatPhone = (num) => {
    if (!num) return 'N/A';
    const digits = num.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('09')) {
      return `+63 ${digits.slice(1,4)} ${digits.slice(4,7)} ${digits.slice(7)}`;
    }
    return num; // fallback
  };

  const getRoleBasePath = () => {
    const role = auth?.user?.role;
    switch (role) {
      case 'super_admin': return '/superadmin';
      case 'city_admin': return '/cityadmin';
      case 'brgy_cap': return '/brgycap';
      default: return '/';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading official details..." />;
  }

  if (error) {
    return (
      <ErrorAlert 
        message={error}
        onRetry={fetchOfficialDetails}
        onBack={() => navigate(`${getRoleBasePath()}/officials`)}
      />
    );
  }

  if (!official) {
    return (
      <ErrorAlert 
        message="Official not found"
        onBack={() => navigate(`${getRoleBasePath()}/officials`)}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1591px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className={`w-32 h-32 bg-gray-200 ${
                hasValidImage ? 'border-0' : 'border-2 border-dashed border-gray-400'
              } rounded flex items-center justify-center overflow-hidden`}>
                {hasValidImage ? (
                  <img
                    src={`http://localhost:5000${official.profile_picture}`}
                    alt={`${official.first_name} ${official.last_name}`}
                    className="w-full h-full object-cover rounded"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <i className="bi bi-person text-5xl text-gray-400"></i>
                )}
              </div>
            </div>

            {/* basic information */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {official.first_name} {official.last_name}
              </h1>
              <p className="text-gray-600 font-medium mb-1 text-lg">
                {official.position || (official.role === 'brgy_cap' ? 'Barangay Captain' : 'Barangay Official')}
              </p>
              <p className="text-gray-600 text-lg">
                {official.barangay || 'N/A'}, Iligan City +9200
              </p>
            </div>
          </div>
        </div>

        {/* personal information */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <i className="bi bi-pencil-square text-lg"></i>
                Edit Details
              </button>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />
          <div className="grid grid-cols-4 gap-x-8 gap-y-6">
            
            <div>
              <label className="block text-md text-gray-600 mb-2">First Name:</label>
              <p className="text-gray-900 font-medium text-lg">{official.first_name}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Last Name:</label>
              <p className="text-gray-900 font-medium text-lg">{official.last_name}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Sex:</label>
              <p className="text-gray-900 font-medium text-lg">{official.sex || 'N/A'}</p>

            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Date of birth:</label>
              <p className="text-gray-900 font-medium text-lg">{formatDate(official.birthdate)}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Email:</label>
              <p className="text-gray-900 font-medium text-lg">{official.email}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Contact:</label>
              <p className="text-gray-900 font-medium text-lg">{formatPhone(official.contact_number) || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">User Role:</label>
              <p className="text-gray-900 font-medium text-lg">
                {official.role === 'brgy_cap' ? 'Barangay Captain' : 
                 official.role === 'brgy_off' ? 'Barangay Official' : 
                 official.role}
              </p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Date registered:</label>
              <p className="text-gray-900 font-medium text-lg">{formatDate(official.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Case Details Card */}
        <div className="bg-white rounded-lg shadow-lg border border-[#B5B5B5] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Case Details</h2>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <i className="bi bi-bookmark text-lg"></i>
              Active Cases Handling
            </button>
          </div>
          <hr className="border-t border-gray-200 mt-4 mb-6" />

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-md text-gray-600 mb-2">Assigned Cases:</label>
              <p className="text-gray-900 font-medium text-3xl">{official.assigned_cases || 0}</p>
            </div>

             <div>
              <label className="block text-md text-gray-600 mb-2">Assigned Cases:</label>
              <p className="text-gray-900 font-medium text-3xl">{official.pending_cases || 0}</p>
            </div>

            <div>
              <label className="block text-md text-gray-600 mb-2">Cases Resolved:</label>
              <p className="text-gray-900 font-medium text-3xl">{official.resolved_cases || 0}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficialDetailsPage;
