import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../contexts/formcontext';
import { ScrollText, SquarePen, UserCircle, CircleCheckBig, ArrowLeft } from 'lucide-react';
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
                const msg = resData.message || resData.error || JSON.stringify(resData) || 'Unknown error';
                alert(`Failed to submit: ${msg}`);
                return;
            }

            //start change
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

            // Add a check in case the backend fails to send the code
            if (!complaintCode) {
                console.error("Submission successful, but backend did not return a 'complaint_code'.", resData);
                alert("Submission successful, but failed to retrieve tracking code. Please contact support.");
                return;
            }

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
            <div className='flex flex-col items-center place-content-between bg-white'>
                {/* PROGRESS BAR */}
                <div className='w-full flex justify-center mb-8'>
                    <div className="mx-auto max-w-[1500px] w-[80%]">
                        {/* <h1 className='font-bold text-xl text-blue-400 pb-3 ml-40'>Create Complaint</h1> */}
                        <div>
                            <div className='flex flex-row justify-between place-items-center gap-3'>
                                <CircleCheckBig size={32} color='#60A5FA' />
                                <div className='flex-grow h-[3px] bg-[#60A5FA]'></div>
                                <CircleCheckBig size={32} color='#60A5FA' />
                                <div className='flex-grow h-[3px] bg-[#60A5FA]'></div>
                                <CircleCheckBig size={32} color='#60A5FA' />
                            </div>
                            <div className='flex flex-row justify-between place-items-center mt-3'>
                                <div className='flex flex-col items-center justify-center flex-1'>
                                    <h1 className='font-bold leading-none text-base'>STEP 1</h1>
                                    <p className='text-sm text-gray-500'>Provide complainant info</p>
                                </div>
                                <div className='flex flex-col items-center justify-center flex-1'>
                                    <h1 className='font-bold leading-none text-base'>STEP 2</h1>
                                    <p className='text-sm text-gray-500'>Provide complaint details</p>
                                </div>
                                <div className='flex flex-col items-center justify-center flex-1'>
                                    <h1 className='font-bold leading-none text-base'>STEP 3</h1>
                                    <p className='text-sm text-gray-500'>Review and Submit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-center'>
                    <div className="border-2 border-gray-200 mx-auto max-w-[1500px] w-[80%] px-16 py-10 rounded-lg mb-5 shadow-md">
                        <div className="flex flex-row gap-1 border-b-2 border-gray-200 pb-3 mb-8">
                            <h1 className="font-bold text-blue-400 text-3xl">Step 3:</h1>
                            <h1 className="font-medium text-black text-3xl">Complaint Summary</h1>
                        </div>
                        {/* COMPLAINANT INFO */}
                        <div className='w-full mb-8'>
                            <div className='flex flex-row justify-between items-center mb-4'>
                                    <div className='flex flex-row items-center gap-4'>
                                        <UserCircle size={28} color='#808080' />
                                        <h2 className="text-xl font-semibold">Complainant Information</h2>
                                    </div>
                                    <div className='flex flex-row items-center gap-2 border-2 rounded-md px-3 py-1.5 hover:bg-gray-100 cursor-pointer transition'>
                                        <button
                                            className="text-base text-[#5d5d5dff] font-bold"
                                            onClick={() => navigate("/file-complaint/complainantinfo")}
                                        >
                                            Edit
                                        </button>
                                        <SquarePen size={18} color='#5d5d5dff' />
                                    </div>
                                </div>


                                {/* info */}
                            <div className='grid grid-cols-2 gap-x-20 ml-12 text-base'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>First name</span>
                                        <span className='font-medium'>{formData.first_name || "Not provided"}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Last name</span>
                                        <span className='font-medium'>{formData.last_name || "Not provided"}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Sex</span>
                                        <span className='font-medium'>{formData.sex || "Not provided"}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Age</span>
                                        <span className='font-medium'>{formData.age || "Not provided"}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Contact Number</span>
                                        <span className='font-medium'>{formData.contact_number}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Barangay</span>
                                        <span className='font-medium'>{barangayName || "Loading..."}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <span className='text-gray-600 w-40'>Email Address</span>
                                        <span className='font-medium'>{formData.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COMPLAINT DETAILS */}
                        <div className='w-full mb-8'>
                            <div className='flex flex-row justify-between items-center mb-4'>
                                <div className='flex flex-row items-center gap-5'>
                                    <ScrollText size={28} color='#808080' />
                                    <h2 className="text-xl font-semibold">Complaint Details</h2>
                                </div>
                                <div className='flex flex-row items-center gap-2 border-2 rounded-md px-3 py-1.5 hover:bg-gray-100 cursor-pointer transition'>
                                    <button
                                        className="text-base text-[#5d5d5dff] font-bold"
                                        onClick={() => navigate("/file-complaint/complaintdetails")}
                                    >
                                        Edit
                                    </button>
                                    <SquarePen size={18} color='#5d5d5dff' />
                                </div>
                            </div>

                            {/* details */}
                            <div className='flex flex-col ml-14 gap-2 text-base'>
                                <div className='flex flex-row'>
                                    <span className='text-gray-600 w-48'>Complaint Title</span>
                                    <span className='flex-1 font-medium'>{formData.complaint_title}</span>
                                </div>
                                <div className='flex flex-row'>
                                    <span className='text-gray-600 w-48'>Case Type</span>
                                    <span className='flex-1 font-medium'>{formData.case_type}</span>
                                </div>
                                <div className='flex flex-row'>
                                    <span className='text-gray-600 w-48'>Description</span>
                                    <span className='flex-1 font-medium'>{formData.description}</span>
                                </div>
                                <div className='flex flex-row'>
                                    <span className='text-gray-600 w-48'>Full Address</span>
                                    <span className='flex-1 font-medium'>{formData.full_address}</span>
                                </div>
                                <div className='flex flex-row'>
                                    <span className='text-gray-600 w-48'>Specific Location</span>
                                    <span className='flex-1 font-medium'>{formData.specific_location || "Not provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* buttons */}
                        <div className="flex flex-row justify-between text-white px-5 mt-8">
                            <button
                                onClick={() => navigate("/file-complaint/complaintdetails")}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-gray-400 rounded-lg font-bold py-2 px-6 mb-3 text-base"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
            
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-2 px-6 mb-3 text-base"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            
                {/* confirmation modal */}
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



