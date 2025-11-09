import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../components/formcontext';
import { ScrollText, SquarePen, UserCircle, CircleCheck, CircleCheckBig, ArrowLeft, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CU_ComplaintSummaryPage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();

    const [showModal, setShowModal] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);
    const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [barangayName, setBarangayName] = useState('');
    const [barangays, setBarangays] = useState([]);

    useEffect(() => {
        const fetchBarangayName = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/complaints/barangays');
                    if (!response.ok) {
                    throw new Error('Failed to fetch barangays');
                }

                const barangays = await response.json();
                const selectedBarangay = barangays.find(
                    (b) => b.id === parseInt(formData.barangay)
                );

                if (selectedBarangay) {
                    setBarangayName(selectedBarangay.name);
                } else {
                    setBarangayName('Unknown Barangay');
                }
            } catch (error) {
                console.error('Error fetching barangay name:', error);
                setBarangayName('Error loading barangay');
            }
        };

        if (formData.barangay) {
            fetchBarangayName();
        }
    }, [formData.barangay]);

    
    const initialFormData = {
        first_name: "",
        last_name: "",
        sex: "",
        age: "",
        contact_number: "",
        email: "",
        barangay: "",
        complaint_title: "",
        case_type: "",
        description: "",
        full_address: "",
        specific_location: ""
    };

    


    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Prepare data with proper types
            const submissionData = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
            };

            // Debug: Log the data being sent
            console.log('Submitting complaint data:', submissionData);

            const res = await fetch("http://127.0.0.1:5000/api/complaints/create_complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            // Always parse JSON body for more useful error/success handling
            const resData = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error('Server error response:', resData);
                // Prefer readable message fields, fallback to stringified body
                const msg = resData.message || resData.error || JSON.stringify(resData) || 'Unknown error';
                alert(`Failed to submit: ${msg}`);
                return;
            }

            // Extract complaint id returned by backend
            const complaintId = resData.complaint_id || resData.complaintId || resData.id || null;
            const complainantId = resData.complainant_id || resData.complainantId || null;

            // Build a user-facing tracking code in the format CMP-YYYYMMDD-NNNN
            // where NNNN is the complaint id padded to 4 digits
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const datePart = `${yyyy}${mm}${dd}`;
            const seqPart = complaintId ? String(complaintId).padStart(4, '0') : '0000';
            const complaintCode = `CMP-${datePart}-${seqPart}`;

            // Reset form and close modal, then navigate passing tracking info in location state
            updateFormData(initialFormData);
            setShowModal(false);
            navigate("/file-complaint/completionmessage", { state: { complaintCode, complaintId, complainantId } });
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('An unexpected error occurred while submitting the complaint. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            {/* BREADCRUMB */}
            <div className='w-full pb-3'>
                <div className="flex flex-row mx-auto items-center place-items-center max-w-[1500px] w-[80%] mb-5 gap-3 text-sm text-gray-400">
                    <button> <Home size={17}/> </button>
                    <h1>/</h1>
                    <button>Complaints</button>
                    <h1>/</h1>
                    <button>File a Complaint</button>
                    <h1>/</h1>
                    <button className='font-medium text-gray-500'>Complaint Summary</button>
                </div>
            </div>
            
            <div className='flex flex-col items-center place-content-between bg-white'>
                {/* PROGRESS BAR */}
                <div className='w-full flex justify-center'>
                    <div className="mx-auto max-w-[1500px] w-[80%] mb-5">
                        {/* <h1 className='font-bold text-xl text-blue-400 pb-3 ml-40'>Create Complaint</h1> */}
                        <div>
                            <div className='flex flex-row justify-between place-items-center gap-3 mx-40'>
                                <CircleCheckBig size={28} color='#60A5FA' />
                                <div className='flex-grow h-[2.4px] bg-[#60A5FA]'></div>
                                <CircleCheckBig size={28} color='#60A5FA' />
                                <div className='flex-grow h-[2.4px] bg-[#60A5FA]'></div>
                                <CircleCheck size={28} color='#60A5FA' />
                            </div>
                            <div className='flex flex-row justify-between place-items-center gap-3 mx-[78px] mt-1'>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 1</h1>
                                    <p className='text-sm text-gray-500'>Provide complainant info</p>
                                </div>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 2</h1>
                                    <p className='text-sm text-gray-500'>Provide complaint details</p>
                                </div>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 3</h1>
                                    <p className='text-sm text-gray-500'>Review and Submit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-center'>
                    <div className="border-2 border-gray-200 mx-auto max-w-[1500px] w-[80%] px-10 py-5 rounded-lg mb-5 shadow-md">
                        <div className="flex flex-row gap-1 border-b-2 border-gray-200 pb-2">
                            <h1 className="font-bold text-blue-400 text-2xl">Step 3:</h1>
                            <h1 className="font-medium text-black text-2xl">Complaint Summary</h1>
                        </div>
                        {/* COMPLAINANT INFO */}
                        <div className='w-full flex justify-center'>
                            <div className="mx-auto max-w-[1500px] w-[100%] mb-5 p-5">
                                <div className='flex flex-row justify-between items-center'>
                                    <div className='flex flex-row items-center gap-4 mb-3'>
                                        <UserCircle size={24} color='#808080' />
                                        <h2 className="text-xl font-medium">Complainant Information</h2>
                                    </div>
                                    <div className='flex flex-row items-center gap-2 mb-3 border-2 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer transition'>
                                        <button
                                            className="text-sm text-[#5d5d5dff] font-bold"
                                            onClick={() => navigate("/file-complaint/complainantinfo")}
                                        >
                                            Edit
                                        </button>
                                        <SquarePen size={16} color='#5d5d5dff' />
                                    </div>
                                </div>
                                {/* DETAILS HERE */}
                                <div className='flex flex-row justify-between ml-10 mr-52'>
                                    <div className='flex flex-row justify-between gap-12'>
                                        <div className='text-[#808080] w-32'>
                                            <h1>First name</h1>
                                            <h1>Last name</h1>
                                            <h1>Sex</h1>
                                            <h1>Age</h1>
                                        </div>
                                        <div className='font-medium'>
                                            <h1>{formData.first_name || "Not provided"}</h1>
                                            <h1>{formData.last_name || "Not provided"}</h1>
                                            <h1>{formData.sex || "Not provided"}</h1>
                                            <h1>{formData.age || "Not provided"}</h1>
                                        </div>
                                    </div>
                                    <div className='flex flex-row justify-between gap-12'>
                                        <div className='text-[#808080] w-32'>
                                            <h1>Contact Number</h1>
                                            <h1>Barangay</h1>
                                            <h1>Email Address</h1>
                                        </div>
                                        <div className='font-medium'>
                                            <h1>{formData.contact_number}</h1>
                                            <h1>{barangayName || "Loading..."}</h1>
                                            <h1>{formData.email}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* COMPLAINT DETAILS */}
                        <div className='w-full flex justify-center'>
                            <div className="mx-auto max-w-[1500px] w-[100%] mb-5 p-5">
                                <div className='flex flex-row justify-between items-center'>
                                    <div className='flex flex-row items-center gap-5 mb-3'>
                                        <ScrollText size={24} color='#808080' />
                                        <h2 className="text-xl font-medium">Complaint Details</h2>
                                    </div>
                                    <div className='flex flex-row items-center gap-2 mb-3 border-2 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer transition'>
                                        <button
                                            className="text-sm text-[#5d5d5dff] font-bold"
                                            onClick={() => navigate("/file-complaint/complaintdetails")}
                                        >
                                            Edit
                                        </button>
                                        <SquarePen size={16} color='#5d5d5dff' />
                                    </div>
                                </div>
                                {/* DETAILS HERE */}
                                <div className='flex flex-col ml-11'>
            
                                    <div className='flex flex-row'>
                                        <h1 className='w-44 text-[#808080]'>Complaint Title</h1>
                                        <p className='w-10/12 font-medium'>{formData.complaint_title}</p>
                                    </div>
                                    <div className='flex flex-row'>
                                        <h1 className='w-44 text-[#808080]'>Case Type</h1>
                                        <p className='w-10/12 font-medium'>{formData.case_type}</p>
                                    </div>
                                    <div className='flex flex-row'>
                                        <h1 className='w-44 text-[#808080]'>Description</h1>
                                        <p className='w-10/12 font-medium'>{formData.description}</p>
                                    </div>
                                    <div className='flex flex-row'>
                                        <h1 className='w-44 text-[#808080]'>Full Address</h1>
                                        <p className='w-10/12 font-medium'>{formData.full_address}</p>
                                    </div>
                                    <div className='flex flex-row'>
                                        <h1 className='w-44 text-[#808080]'>Specific Location</h1>
                                        <p className='w-10/12 font-medium'>{formData.specific_location || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* next button */}
                        <div className="flex flex-row justify-between text-white px-5">
                            <button
                                onClick={() => navigate("/file-complaint/complaintdetails")}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-gray-400 rounded-lg font-bold py-1 px-5 mb-3"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
            
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-1 px-5 mb-3"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            
                {/*  confirmation modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-grey-900 bg-opacity-20 backdrop-blur-sm z-40">
                        <div className="bg-white rounded-xl shadow-xl p-8 w-[550px] text-center">
                            <h1 className="text-lg leading-tight font-semibold mb-4 text-black">
                                Are you sure you want to submit this complaint?
                            </h1>
                            <label className="flex justify-center space-x-2 mb-6">
                                <input
                                    type="checkbox"
                                    className="w-4 h-5 accent-green-600"
                                    checked={isConfirmedCheckbox}
                                    onChange={(e) => {
                                        setIsConfirmedCheckbox(e.target.checked);
                                        if (e.target.checked) setShowCheckboxError(false);
                                    }}
                                />
                                <div className="flex flex-col text-left text-sm text-gray-600">
                                    <span className="text-sm font-bold text-gray-700 pb-2">I am sure and the details are accurate</span>
                                    <span className="text-sm leading-none">Before submitting, please check your complaint. Make sure the details are true and accurate.
                                        False information may lead to dismissal or penalties. By submitting, you confirm everything
                                        is given honestly and in good faith.
                                    </span>
                                    <span className="text-sm mt-2 leading-none">Once confirmed, please check your email for updates on your complaint.
                                    </span>
                                </div>
                            </label>
                            {showCheckboxError && (
                                <p className="text-sm leading-none pb-5 text-red-600 mt-2">You must check the confirmation box before submitting.</p>
                            )}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (!isConfirmedCheckbox) {
                                            setShowCheckboxError(true);
                                            return;
                                        }
                                        handleSubmit();
                                    }}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 bg-emerald-600 text-white rounded-md transition ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                                    }`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

