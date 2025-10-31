import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import Navbar from '../../../components/navbarComplainant.jsx';
import TopHeader from '../../../components/topHeader.jsx';
import Footer from '../../../components/footer.jsx';

const CU_FileComplaintPage = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col place-content-between w-full bg-white'>
            <div>
                <div>breadcrumb</div>
                ---- o ----- o -------
                <div></div>
            </div>
            <div>
                <div className="border-2 border-gray-200 mx-20 px-10 py-5 rounded-lg mb-5 shadow-md">
                    <div className="flex flex-row gap-1 border-b-2 border-gray-200 pb-2">
                        <h1 className="font-bold text-blue-400 text-2xl">Step 1:</h1>
                        <h1 className="font-medium text-black text-2xl">Complainant Info</h1>
                    </div>
                
                    {/* form */}
                    <div className="flex flex-row text-black gap-20 p-5">
                        {/* left */}
                        <div className="flex flex-col w-2/4">
                            <label>First Name: </label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="border border-gray-300 px-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />
                
                            <div className="flex flex-row gap-5 my-4">
                                <div className="flex flex-col w-2/4">
                                    <label>Sex:</label>
                                    <select className="border border-gray-300 px-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition">
                                        <option>--Select Sex--</option>
                                        <option>Female</option>
                                        <option>Male</option>
                                    </select>
                                </div>
                                <div className="flex flex-col w-2/4">
                                    <label>Age: </label>
                                    <input
                                        type="number"
                                        min='1' max='100'
                                        placeholder='Enter your age'
                                        className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                                    />
                                </div>
                            </div>
                
                            <label>Contact Number: </label>
                            <input
                                type="text"
                                placeholder="Enter your contact number"
                                className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />
                        </div>
                        {/* right */}
                        <div className="flex flex-col w-2/4">
                            <label>Last Name: </label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />
                            <div className="flex flex-col my-4">
                                <label>Barangay: </label>
                                <select className="border border-gray-300 px-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition">
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
                                className="border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />
                        </div>
                    </div>
                    {/* next button */}
                    <div className="grid justify-items-end text-white px-5">
                        <button
                            onClick={() => navigate("/file-complaint/step2")}
                            className="flex flex-row justify-center place-items-center gap-3 w-50 bg-blue-400 rounded-lg py-1 px-5 mb-3 mr-2"
                        >
                            Next
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    ); 
}











export default CU_FileComplaintPage;