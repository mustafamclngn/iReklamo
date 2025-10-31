import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../components/formcontext.jsx';
import { ArrowRight, ArrowLeft, CircleCheck, CircleCheckBig, Home } from "lucide-react";
import Footer from '../../../components/footer.jsx';

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();


    const handleNext = (e) => {
        e.preventDefault();
        navigate('/file-complaint/summary');
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
                                <CircleCheck size={28} color='#60A5FA' />
                                <div className='flex-grow h-[2.4px] bg-[#808080]'></div>
                                <CircleCheck size={28} color='gray' />
                            </div>
                            <div className='flex flex-row justify-between place-items-center gap-3 mx-[78px] mt-1'>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 1</h1>
                                    <p className='text-sm text-gray-500'>Provide complainant info</p>
                                </div>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 2</h1>
                                    <p className='text-sm text-gray-500'>Provide complaint info</p>
                                </div>
                                <div className='flex flex-col items-center justify-center w-48'>
                                    <h1 className='font-bold leading-none'>STEP 3</h1>
                                    <p className='text-sm text-gray-500'>Review and Submit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className='w-full flex justify-center'> {/* referenceeee */}
                    <div className="border-2 border-gray-200 mx-auto max-w-[1500px] w-[80%] px-10 py-5 rounded-lg mb-5 shadow-md">
                        <div className="flex flex-row gap-1 border-b-2 border-gray-200 pb-2">
                            <h1 className="font-bold text-blue-400 text-2xl">Step 2:</h1>
                            <h1 className="font-medium text-black text-2xl">Complaint Details</h1>
                        </div>
            
                        {/* form */}
                        <form onSubmit={handleNext} className="flex flex-row w-full text-black gap-20 p-5">
                            <div className="flex flex-col flex-1">
                                <label>Complaint Title: </label>
                                <input
                                    type="text"
                                    placeholder="Brief description of your complaint"
                                    value={formData.complaint_title}
                                    onChange={(e) => updateFormData({ complaint_title: e.target.value })}
                                    className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                />
                                <div className="flex flex-col w-full">
                                    <label>Case Type: </label>
                                    <select
                                        value={formData.case_type}
                                        onChange={(e) => updateFormData({ case_type: e.target.value })}
                                        className="w-full border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Select Case Type</option>
                                        <option>Damaged Roads</option>
                                        <option>Garbage Collection Problem</option>
                                        <option>Water Supply Issue</option>
                                        <option>Illegal Dumping</option>
                                        <option>Noise Complaint</option>
                                        <option>Public Disturbance</option>
                                        <option>Barangay Personnel Misconduct</option>
                                        <option>Delayed Government Service</option>
                                        <option>Corruption or Bribery</option>
                                        <option>Business Overpricing</option>
                                        <option>Fraudulent Transaction</option>
                                        <option>Violence or Abuse Report</option>
                                        <option>Other</option>
                                    </select>
                                    <label>Description:</label>
                                    <textarea
                                        placeholder="Please provide a detailed description of the issue, including all the relevant and necessary information in the complaint"
                                        value={formData.description}
                                        onChange={(e) => updateFormData({ description: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-md text-sm my-2 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                    <label>Full address:</label>
                                    <input
                                        type="text"
                                        placeholder="Provide the complete address where the incident took place"
                                        value={formData.full_address}
                                        onChange={(e) => updateFormData({ full_address: e.target.value })}
                                        className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                    <label>Specific location: </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. in front of Barangay Hall, near the park, etc."
                                        value={formData.specific_location}
                                        onChange={(e) => updateFormData({ specific_location: e.target.value })}
                                        className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                </div>
                            </div>
                        </form>
                        {/* next button */}
                        <div className="flex flex-row justify-between text-white px-5">
                            <button
                                onClick={() => navigate("/file-complaint/complainantinfo")}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-gray-400 rounded-lg font-bold py-1 px-5 mb-3"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
            
                            <button
                                type="submit"
                                onClick={() => navigate("/file-complaint/summary")}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-1 px-5 mb-3"
                            >
                                Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    ); 
}











export default CU_FileComplaintPage;