import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../contexts/formcontext.jsx';
import { ArrowRight, CircleCheck } from "lucide-react";
import '../../../assets/css/checkbox.css';

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
        
        // If anonymous is checked, first name, last name, sex, and age are NOT required
        // Otherwise, these fields are required
        if (!formData.is_anonymous) {
            if (!formData.first_name) missing.first_name = 'Required';
            if (!formData.last_name) missing.last_name = 'Required';
            if (!formData.sex) missing.sex = 'Required';
            if (!formData.age) missing.age = 'Required';
            else if (formData.age > 120) missing.age = 'Invalid age';
        } else {
            // Even if anonymous, validate age if provided
            if (formData.age && formData.age > 120) missing.age = 'Invalid age';
        }
        
        // These are always required
        if (!formData.barangay) missing.barangay = 'Required';
        if (!formData.email) {
            missing.email = 'Required' 
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            missing.email = "Invalid email format";
        }
        if (!formData.contact_number) missing.contact_number = 'Required';

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
                            <div className='flex flex-row justify-between place-items-center gap-3 mx-44 px-3'>
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
                            <h1 className="font-bold text-black text-3xl">Complainant Info</h1>
                        </div>
            
                        {/* form */}
                        <div>
                            <div className="grid grid-cols-2 gap-x-20 px-5 text-black">
                                {/* first name */}
                                <div className="flex flex-col">
                                    <label className="text-base font-medium mb-2">
                                        First Name:{!formData.is_anonymous && ' *'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ibutang imong pangalan"
                                        value={formData.first_name}
                                        onChange={(e) => {
                                            updateFormData({ first_name: e.target.value });
                                            if (errors.first_name) setErrors(prev => ({ ...prev, first_name: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition placeholder:italic ${
                                            errors.first_name 
                                                ? 'border border-red-500' 
                                                : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'
                                        }`}
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
                                    <label className="text-base font-medium mb-2">
                                        Last Name:{!formData.is_anonymous && ' *'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ibutang imong apelyido"
                                        value={formData.last_name}
                                        onChange={(e) => {
                                            updateFormData({ last_name: e.target.value });
                                            if (errors.last_name) setErrors(prev => ({ ...prev, last_name: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md h-10 text-base focus:outline-none transition placeholder:italic ${
                                            errors.last_name 
                                                ? 'border border-red-500' 
                                                : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'
                                        }`}
                                    />
                                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                </div>

                                {/* contact number */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Contact Number: *</label>
                                    <input
                                        type="text"
                                        placeholder="Ibutang imong contact number"
                                        value={formData.contact_number}
                                        onChange={(e) => {
                                            updateFormData({ contact_number: e.target.value });
                                            if (errors.contact_number) setErrors(prev => ({ ...prev, contact_number: ''}));
                                        }}
                                        className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition placeholder:italic ${errors.contact_number ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>}
                                </div>

                                {/* sex and age*/}
                                <div className="flex flex-row flex-wrap gap-5 mt-6">
                                    <div className="flex flex-col flex-1">
                                        <label className="text-base font-medium mb-2">
                                            Sex:{!formData.is_anonymous && ' *'}
                                        </label>
                                        <select
                                            value={formData.sex}
                                            onChange={(e) => {
                                                updateFormData({ sex: e.target.value });
                                                if (errors.sex) setErrors(prev => ({ ...prev, sex: ''}));
                                            }}
                                            className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition ${
                                                errors.sex 
                                                    ? 'border border-red-500' 
                                                    : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'
                                            }`}
                                        >
                                            <option value="">Select Sex</option>
                                            <option>Female</option>
                                            <option>Male</option>
                                        </select>
                                        {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="text-base font-medium mb-2">
                                            Age:{!formData.is_anonymous && ' *'}
                                        </label>
                                        <input
                                            type="number"
                                            min='1' max='100'
                                            value={formData.age}
                                            onChange={(e) => {
                                                updateFormData({ age: e.target.value });
                                                if (errors.age) setErrors(prev => ({ ...prev, age: ''}));
                                            }}
                                            placeholder='Ibutang imong edad'
                                            className={`px-3 py-2 rounded-md text-base h-10 focus:outline-none transition placeholder:italic ${
                                                errors.age 
                                                    ? 'border border-red-500' 
                                                    : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'
                                            }`}
                                        />
                                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                                    </div>
                                </div>

                                {/* email */}
                                <div className="flex flex-col mt-6">
                                    <label className="text-base font-medium mb-2">Email Address: *</label>
                                    <input
                                        type="email"
                                        placeholder="Ibutang imong email address"
                                        value={formData.email}
                                        onChange={(e) => {
                                            updateFormData({ email: e.target.value });
                                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                        }}
                                        className={`px-3 py-2 rounded-md h-10 text-base focus:outline-none transition placeholder:italic ${errors.email ? 'border border-red-500' : 'border border-gray-300 focus:ring-1 focus:ring-blue-400'}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                {/* anonymous option */}
                                <div className="checkbox-wrapper-46 mt-7">
                                    <div className='flex flex-row w-full items-center mb-3 gap-3 text-gray-500'>
                                        <div className='flex-1 w-92 h-[1px] bg-gray-200' />
                                        <h1>or</h1>
                                        <div className='flex-1 w-92 h-[1px] bg-gray-200' />
                                    </div>
                                    
                                    <input 
                                        type="checkbox" 
                                        id="cbx-46" 
                                        className="inp-cbx" 
                                        name='is_anonymous' 
                                        checked={formData.is_anonymous}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            updateFormData({
                                                is_anonymous: isChecked
                                            });
                                            // Clear errors for those fields
                                            if (isChecked) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.first_name;
                                                    delete newErrors.last_name;
                                                    delete newErrors.sex;
                                                    delete newErrors.age;
                                                    return newErrors;
                                                });
                                            }
                                        }}/>
                                    <label htmlFor="cbx-46" className="cbx flex flex-row place-items-center gap-3">
                                        <span>
                                        <svg viewBox="0 0 12 10" height="10px" width="12px">
                                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
                                        <div className="text-base font-medium flex flex-row gap-1">
                                            <h1>Submit Complaint </h1>
                                            <h1 className="font-bold text-[#60A5FA]">Anonymously</h1>
                                        </div>
                                    </label>
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