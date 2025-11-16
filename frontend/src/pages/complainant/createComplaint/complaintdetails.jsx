import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../contexts/formcontext.jsx';
import { ArrowRight, ArrowLeft, CircleCheck, CircleCheckBig } from "lucide-react";

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();

    const [errors, setErrors] = React.useState({});

    const handleNext = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const missing = {};
        if (!formData.complaint_title) missing.complaint_title = 'Required';
        if (!formData.case_type) missing.case_type = 'Required';
        if (!formData.description) missing.description = 'Required';
        if (!formData.full_address) missing.full_address = 'Required';

        if (Object.keys(missing).length > 0) {
            setErrors(missing);
            return;
        }

        setErrors({});
        navigate('/file-complaint/summary')
    }

    return (
        <div>
            <div className='flex flex-col items-center place-content-between bg-white'>
                {/* PROGRESS BAR */}
                <div className='w-full flex justify-center mb-8'>
                    <div className="mx-auto max-w-[1500px] w-[80%]">
                        <div>
                            <div className='flex flex-row justify-between place-items-center gap-3'>
                                <CircleCheckBig size={32} color='#60A5FA' />
                                <div className='flex-grow h-[3px] bg-[#60A5FA]'></div>
                                <CircleCheck size={32} color='#60A5FA' />
                                <div className='flex-grow h-[3px] bg-[#808080]'></div>
                                <CircleCheck size={32} color='gray' />
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
                            <h1 className="font-bold text-blue-400 text-3xl">Step 2:</h1>
                            <h1 className="font-medium text-black text-3xl">Complaint Details</h1>
                        </div>
            
                        {/* form */}
                        <div>
                            <div className="flex flex-col px-5 text-black">
                                <label className="text-base font-medium mb-2">Complaint Title: *</label>
                                <input
                                    type="text"
                                    placeholder="Brief description of your complaint"
                                    value={formData.complaint_title}
                                    onChange={(e) => {
                                        updateFormData({ complaint_title: e.target.value });
                                        if (errors.complaint_title) setErrors(prev => ({ ...prev, complaint_title: '' }));
                                    }}
                                    className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.complaint_title ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                />
                                {errors.complaint_title && <p className="text-red-500 text-sm mt-1">{errors.complaint_title}</p>}

                                <label className="text-base font-medium mb-2 mt-6">Case Type: *</label>
                                <select
                                    value={formData.case_type}
                                    onChange={(e) => {
                                        updateFormData({ case_type: e.target.value });
                                        if (errors.case_type) setErrors(prev => ({ ...prev, case_type: '' }));
                                    }}
                                    className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.case_type ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Infrastructure & Utilities">Infrastructure & Utilities</option>
                                    <option value="Environment & Sanitation">Environment & Sanitation</option>
                                    <option value="Peace & Order">Peace & Order</option>
                                    <option value="Government Service & Conduct">Government Service & Conduct</option>
                                    <option value="Consumer & Business Complaints">Consumer & Business Complaints</option>
                                    <option value="Public Safety & Welfare">Public Safety & Welfare</option>
                                    <option value="Other">Other</option>

                                </select>
                                {errors.case_type && <p className="text-red-500 text-sm mt-1">{errors.case_type}</p>}

                                <label className="text-base font-medium mb-2 mt-6">Description: *</label>
                                <textarea
                                    placeholder="Please provide a detailed description of the issue, including all the relevant and necessary information in the complaint"
                                    value={formData.description}
                                    onChange={(e) => {
                                        updateFormData({ description: e.target.value });
                                        if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                                    }}
                                    className={`px-3 py-2 rounded-md text-base min-h-32 focus:outline-none transition ${errors.description ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

                                <label className="text-base font-medium mb-2 mt-6">Full Address: *</label>
                                <input
                                    type="text"
                                    placeholder="Provide the complete address where the incident took place"
                                    value={formData.full_address}
                                    onChange={(e) => {
                                        updateFormData({ full_address: e.target.value });
                                        if (errors.full_address) setErrors(prev => ({ ...prev, full_address: '' }));
                                    }}
                                    className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.full_address ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                />
                                {errors.full_address && <p className="text-red-500 text-sm mt-1">{errors.full_address}</p>}

                                <label className="text-base font-medium mb-2 mt-6">Specific Location:</label>
                                <input
                                    type="text"
                                    placeholder="e.g. in front of Barangay Hall, near the park, etc."
                                    value={formData.specific_location}
                                    onChange={(e) => {
                                        updateFormData({ specific_location: e.target.value });
                                        if (errors.specific_location) setErrors(prev => ({ ...prev, specific_location: '' }));
                                    }}
                                    className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.specific_location ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                />
                                {errors.specific_location && <p className="text-red-500 text-sm mt-1">{errors.specific_location}</p>}
                            </div>
                        </div>

                        {/* buttons */}
                        <div className="flex flex-row justify-between text-white px-5 mt-8">
                            <button
                                onClick={() => navigate("/file-complaint/complainantinfo")}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-gray-400 rounded-lg font-bold py-2 px-6 mb-3 text-base"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
            
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-2 px-6 mb-3 text-base"
                            >
                                Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default CU_FileComplaintPage;