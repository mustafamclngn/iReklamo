import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import Footer from '../../../components/footer.jsx';



export default function ComplaintSummary() {
    return (
        <div>
            <ComplainantDetails />
        </div>
    )
}







function ComplainantDetails() {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col place-content-between w-full bg-white'>
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


function ComplaintDetails() {
    const [showModal, setShowModal] = useState(false);
    const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);
    const [showCheckboxError, setShowCheckboxError] = useState(false);

    const navigate = useNavigate();

    return (
        <div className='bg-[#ffffff]'>
            <div className="bg-[#ffffff] border-2 border-gray-200 mb-5 mx-20 px-10 py-5 rounded-lg shadow-md">
                <div className="flex flex-row gap-1 border-b-2 border-gray-200 pb-2">
                    <h1 className="font-bold text-blue-400 text-2xl">Step 2:</h1>
                    <h1 className="font-medium text-black text-2xl">Complaint Details</h1>
                </div>

                {/* form */}
                <div className="flex flex-row text-black gap-20 p-5 w-full">
                    <div className="flex flex-col flex-1">
                        <label>Complaint Title: </label>
                        <input 
                            type="text" 
                            placeholder="Brief description of your complaint" 
                            className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                        />

                        <div className="flex flex-col w-full">
                            <label>Case Type: </label>
                            <select className="w-full border border-gray-300 p-1 rounded-md h-7 text-sm my-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition">
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
                                className="w-full border border-gray-300 p-2 rounded-md text-sm my-2 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />

                            <label>Full address:</label>
                            <input
                                type="text"
                                placeholder="Provide the complete address where the incident took place"
                                className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />

                            <label>Specific location: </label>
                            <input
                                type="text"
                                placeholder="e.g. in front of Barangay Hall, near the park, etc."
                                className="w-full border border-gray-300 p-1 rounded-md text-sm my-2 h-7 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                            />
                        </div>
                    </div>
                </div>

                {/* next button */}
                <div className="flex flex-row justify-between text-white px-5">
                    <button 
                        className="flex flex-row justify-center place-items-center gap-1 w-50 bg-gray-500 rounded-lg font-bold py-1 px-5 mb-3 mr-2"
                        onClick={() => navigate('/file-complaint/step1')} >
                        <ArrowLeft className="inline-block" size={20} />
                        BACK
                    </button>
                    
                    <button 
                        className="flex flex-row justify-center place-items-center gap-1 w-50 bg-blue-400 rounded-lg font-bold py-1 px-5 mb-3 mr-2"
                        onClick={() => setShowModal(true)} >
                        NEXT
                        <ArrowRight className="inline-block" size={20} />
                    </button>
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
                                        // Ensure the user checked the confirmation box before proceeding
                                        if (!isConfirmedCheckbox) {
                                            setShowCheckboxError(true);
                                            return;
                                        }

                                        // Add your submit logic here (checkbox is checked)
                                        setShowModal(false);
                                    }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}