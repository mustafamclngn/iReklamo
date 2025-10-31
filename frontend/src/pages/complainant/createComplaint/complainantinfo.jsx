import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../../../components/formcontext.jsx';
import { ArrowRight, CircleCheck, Home } from "lucide-react";
import Footer from '../../../components/footer.jsx';

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();

    const handleNext = (e) => {
        e.preventDefault();
        navigate("/file-complaint/complaintdetails");
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
                                        onChange={(e) => updateFormData({ first_name: e.target.value })}
                                        className="border border-gray-300 px-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                    <div className="flex flex-row gap-5 my-4">
                                        <div className="flex flex-col w-2/4">
                                            <label>Sex:</label>
                                            <select
                                                value={formData.sex}
                                                onChange={(e) => updateFormData({ sex: e.target.value })}
                                                className="border border-gray-300 px-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                            >
                                                <option value="">--Select Sex--</option>
                                                <option>Female</option>
                                                <option>Male</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col w-2/4">
                                            <label>Age: </label>
                                            <input
                                                type="number"
                                                min='1' max='100'
                                                value={formData.age}
                                                onChange={(e) => updateFormData({ age: e.target.value })}
                                                placeholder='Enter your age'
                                                className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                            />
                                        </div>
                                    </div>
                                    <label>Contact Number: </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your contact number"
                                        value={formData.contact_number}
                                        onChange={(e) => updateFormData({ contact_number: e.target.value })}
                                        className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                </div>
                                {/* right */}
                                <div className="flex flex-col w-2/4">
                                    <label>Last Name: </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={formData.last_name}
                                        onChange={(e) => updateFormData({ last_name: e.target.value })}
                                        className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                    <div className="flex flex-col my-4">
                                        <label>Baranggay: </label>
                                        <select
                                            value={formData.baranggay}
                                            onChange={(e) => updateFormData({ baranggay: e.target.value })}
                                            className="border border-gray-300 px-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                        >
                                            <option value="">Select Barangay</option>
                                            {/* this should be from the database */}
                                            <option>Abuno</option>
                                            <option>Acmac (Mariano Badelles Sr)</option>
                                            <option>Bagong Silang</option>
                                            <option>Bonbonon</option>
                                            <option>Bunawan</option>
                                            <option>Buru-un</option>
                                            <option>Dalipuga</option>
                                            <option>Del Carmen</option>
                                            <option>Digkilaan</option>
                                            <option>Ditucalan</option>
                                            <option>Dulag</option>
                                            <option>Hinaplanon</option>
                                            <option>Hindang</option>
                                            <option>Kabacsanan</option>
                                            <option>Kalilangan</option>
                                            <option>Kiwalan</option>
                                            <option>Lanipao</option>
                                            <option>Luinab</option>
                                            <option>Mahayahay</option>
                                            <option>Mainit</option>
                                            <option>Mandulog</option>
                                            <option>Maria Cristina</option>
                                            <option>Pala-o</option>
                                            <option>Panoroganan</option>
                                            <option>Poblacion</option>
                                            <option>Puga-an</option>
                                            <option>Rogongon</option>
                                            <option>San Miguel</option>
                                            <option>San Roque</option>
                                            <option>Santa Elena</option>
                                            <option>Santa Filomena</option>
                                            <option>Santiago</option>
                                            <option>Santo Rosario</option>
                                            <option>Saray-Tibanga</option>
                                            <option>Suarez</option>
                                            <option>Tambacan</option>
                                            <option>Tibanga</option>
                                            <option>Tipanoy</option>
                                            <option>Tomas L. Cabili (Tominobo Proper)</option>
                                            <option>Upper Tominobo</option>
                                            <option>Tubod</option>
                                            <option>Ubaldo Laya</option>
                                            <option>Upper Hinaplanon</option>
                                            <option>Villa Verde</option>
                                        </select>
                                    </div>
                                    <label>Email Address: </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => updateFormData({ email: e.target.value })}
                                        className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                </div>
                            </div>
                        </form>
                        {/* next button */}
                        <div className="grid justify-items-end text-white px-5">
                            <button
                                type='submit'
                                onClick={() => navigate("/file-complaint/complaintdetails")}
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