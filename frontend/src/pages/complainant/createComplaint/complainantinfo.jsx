import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../components/formcontext.jsx';
import { ArrowRight, CircleCheck, Home } from "lucide-react";
import Footer from '../../../components/footer.jsx';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();

    const [barangays, setBarangays] = useState([]);
    const [errors, setErrors] = React.useState({});

    const handleNext = (e) => {
        // for error handlig
        if (e && e.preventDefault) e.preventDefault();
        const missing = {};
        // if (!formData.first_name) missing.first_name = 'Required';
        // if (!formData.last_name) missing.last_name = 'Required';
        // if (!formData.sex) missing.sex = 'Required';
        // if (!formData.age) missing.age = 'Required'; 
        if (formData.age > 120) missing.age = 'Invalid age'
        if (!formData.barangay) missing.barangay = 'Required';
        if (!formData.email) missing.email = 'Required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) missing.email = "Invalid email format";
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
            {/* BREADCRUMB */}
            <div className='w-full pb-3'>
                <div className="flex flex-row mx-auto items-center place-items-center max-w-[1500px] w-[80%] mb-5 gap-3 text-sm text-gray-400">
                    <button> <Home size={17}/> </button>
                    <h1>/</h1>
                    <button className='hover:underline'>Complaints</button>
                    <h1>/</h1>
                    <button className='hover:underline'>File a Complaint</button>
                    <h1>/</h1>
                    <button className='font-medium text-gray-500 hover:underline'>Complainant Info</button>
                </div>
            </div>

            <div className='flex flex-col items-center place-content-between bg-white'>
                
                {/* PROGRESS BAR */}
                <div className='w-full flex justify-center'>
                    <div className="mx-auto max-w-[1500px] w-[80%] mb-5">
                        {/* <h1 className='font-bold text-xl text-blue-400 pb-3 ml-40'>Create Complaint</h1> */}
                        <div>
                            <div className='flex flex-row justify-between place-items-center gap-3 mx-40'>
                                <CircleCheck size={28} color='#60A5FA' />
                                <div className='flex-grow h-[2.4px] bg-[#808080]'></div>
                                <CircleCheck size={28} color='gray' />
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
                            <h1 className="font-bold text-blue-400 text-2xl">Step 1:</h1>
                            <h1 className="font-medium text-black text-2xl">Complainant Info</h1>
                        </div>
            
                        {/* form */}
                        <form onSubmit={handleNext}>
                            <div className="flex flex-row w-full text-black gap-20 p-5">
                                {/* left */}
                                <div className="flex flex-col w-2/4">
                                    <label>First Name: </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={formData.first_name}
                                        onChange={(e) => {
                                            updateFormData({ first_name: e.target.value });
                                            if (errors.first_name) setErrors(prev => ({ ...prev, first_name: '' }));
                                        }}
                                        className={`px-1 rounded-md text-sm my-2 h-7 focus:outline-none transition ${errors.first_name ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                    
                                    <div className="flex flex-row gap-5 my-4">
                                        <div className="flex flex-col w-2/4">
                                            <label>Sex:</label>
                                            <select
                                                value={formData.sex}
                                                onChange={(e) => {
                                                    updateFormData({ sex: e.target.value });
                                                    if (errors.sex) setErrors(prev => ({ ...prev, sex: ''}));
                                                }}
                                                className={`px-1 rounded-md text-sm my-2 h-7 focus:outline-none transition ${errors.sex ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                            >
                                                <option value="">Select Sex</option>
                                                <option>Female</option>
                                                <option>Male</option>
                                            </select>
                                            {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex}</p>}
                                        </div>
                                        
                                        <div className="flex flex-col w-2/4">
                                            <label>Age: </label>
                                            <input
                                                type="number"
                                                min='1' max='100'
                                                value={formData.age}
                                                onChange={(e) => {
                                                    updateFormData({ age: e.target.value });
                                                    if (errors.age) setErrors(prev => ({ ...prev, age: ''}));
                                                }}
                                                placeholder='Enter your age'
                                                className={`px-1 rounded-md text-sm my-2 h-7 focus:outline-none transition ${errors.age ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                            />
                                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                                        </div>
                                    </div>

                                    <label>Contact Number: </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your contact number"
                                        value={formData.contact_number}
                                        onChange={(e) => {
                                            updateFormData({ contact_number: e.target.value });
                                            if (errors.contact_number) setErrors(prev => ({ ...prev, contact_number: ''}));
                                        }}
                                        className={`px-1 rounded-md text-sm my-2 h-7 focus:outline-none transition ${errors.contact_number ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
                                </div>
                                {/* right */}
                                <div className="flex flex-col w-2/4">
                                    <label>Last Name: </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={formData.last_name}
                                        onChange={(e) => {
                                            updateFormData({ last_name: e.target.value });
                                            if (errors.last_name) setErrors(prev => ({ ...prev, last_name: '' }));
                                        }}
                                        className={`p-1 rounded-md h-7 text-sm my-2 focus:outline-none transition ${errors.last_name ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}

                                    <div className="flex flex-col my-4">
                                        <label>Barangay: </label>
                                        <select
                                            value={formData.barangay}
                                            onChange={(e) => {
                                                updateFormData({ barangay: e.target.value });
                                                if (errors.barangay) setErrors(prev => ({ ...prev, barangay: '' }));
                                            }}
                                            className={`p-1 rounded-md h-7 text-sm my-2 focus:outline-none transition ${errors.barangay ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                        >
                                            <option value="">Select Barangay</option>
                                            {barangays.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
                                    </div>

                                    
                                    <label>Email Address: </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => {
                                            updateFormData({ email: e.target.value });
                                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                        }}
                                        className={`p-1 rounded-md h-7 text-sm my-2 focus:outline-none transition ${errors.email ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </form>
                        {/* next button */}
                        <div className="grid justify-items-end text-white px-5">
                            <button
                                type='button'
                                onClick={handleNext}
                                className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-1 px-5 mb-3 mr-2"
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