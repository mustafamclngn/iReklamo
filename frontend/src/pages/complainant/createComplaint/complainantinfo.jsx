import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../contexts/formcontext.jsx';
import { ArrowRight, CircleCheck } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();

    const [barangays, setBarangays] = useState([]);
    const [errors, setErrors] = React.useState({});

    const handleNext = (e) => {
        // for error handling
        if (e && e.preventDefault) e.preventDefault();
        const missing = {};
        
        if (formData.age > 120) missing.age = 'Invalid age'
        if (!formData.barangay) missing.barangay = 'Required';
        if (!formData.email) {
            missing.email = 'Required' 
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            missing.email = "Invalid email format";
        }
        if (!formData.contact_number) missing.contact_number = 'Required'

        if (Object.keys(missing).length > 0) {
            setErrors(missing);
            return;
        }

        // clear errors and proceed
        setErrors({});
        navigate('/file-complaint/complaintdetails');
    };
    
    useEffect(() => {
        fetch(`${API}/api/complaints/barangays`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch barangays');
                return res.json();
            })
            .then((data) => setBarangays(data))
            .catch((err) => console.error("Error fetching barangays:", err));
    }, []);


    return (
        <div>
            <div className='flex flex-col items-center place-content-between bg-white'>
                
                {/* PROGRESS BAR */}
                <div className='w-full flex justify-center mb-8'>
                    <div className="mx-auto max-w-[1500px] w-[80%]">
                        <div>
                            <div className='flex flex-row justify-between place-items-center gap-3'>
                                <CircleCheck size={32} color='#60A5FA' />
                                <div className='flex-grow h-[3px] bg-[#808080]'></div>
                                <CircleCheck size={32} color='gray' />
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
                            <h1 className="font-bold text-blue-400 text-3xl">Step 1:</h1>
                            <h1 className="font-medium text-black text-3xl">Complainant Info</h1>
                        </div>
            
                        {/* form */}
                        <div>
                            <div className="grid grid-cols-2 gap-x-20 px-5 text-black">
                                {/* first name */}
                                <div className="flex flex-col">
                                    <label className="text-base font-medium mb-2">First Name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={formData.first_name}
                                        onChange={(e) => {
                                            updateFormData({ first_name: e.target.value });
                                            if (errors.first_name) setErrors(prev => ({ ...prev, first_name: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.first_name ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                </div>

                                {/* brgy */}
                                <div className="flex flex-col">
                                    <label className="text-base font-medium mb-2">Barangay: *</label>
                                    <select
                                        value={formData.barangay}
                                        onChange={(e) => {
                                            updateFormData({ barangay: e.target.value });
                                            if (errors.barangay) setErrors(prev => ({ ...prev, barangay: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md h-10 text-base focus:outline-none transition ${errors.barangay ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    >
                                        <option value="">Select Barangay</option>
                                        {barangays.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.barangay && <p className="text-red-500 text-sm mt-1">{errors.barangay}</p>}
                                </div>

                                {/* last name */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Last Name:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={formData.last_name}
                                        onChange={(e) => {
                                            updateFormData({ last_name: e.target.value });
                                            if (errors.last_name) setErrors(prev => ({ ...prev, last_name: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md h-10 text-base focus:outline-none transition ${errors.last_name ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                </div>

                                {/* contact number */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Contact Number: *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your contact number"
                                        value={formData.contact_number}
                                        onChange={(e) => {
                                            updateFormData({ contact_number: e.target.value });
                                            if (errors.contact_number) setErrors(prev => ({ ...prev, contact_number: ''}));
                                        }}
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.contact_number ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>}
                                </div>

                                {/* sex */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Sex:</label>
                                    <select
                                        value={formData.sex}
                                        onChange={(e) => {
                                            updateFormData({ sex: e.target.value });
                                            if (errors.sex) setErrors(prev => ({ ...prev, sex: ''}));
                                        }}
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.sex ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    >
                                        <option value="">Select Sex</option>
                                        <option>Female</option>
                                        <option>Male</option>
                                    </select>
                                    {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                                </div>

                                {/* email */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Email Address: *</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => {
                                            updateFormData({ email: e.target.value });
                                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md h-10 text-base focus:outline-none transition ${errors.email ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* age */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Age:</label>
                                    <input
                                        type="number"
                                        min='1' max='100'
                                        value={formData.age}
                                        onChange={(e) => {
                                            updateFormData({ age: e.target.value });
                                            if (errors.age) setErrors(prev => ({ ...prev, age: ''}));
                                        }}
                                        placeholder='Enter your age'
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${errors.age ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid justify-items-end text-white px-5 mt-6">
                            <button
                                type='button'
                                onClick={handleNext}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-2 px-6 mb-3 mr-2 text-base"
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