import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Copy } from 'lucide-react'


export default function Completion() {
    const location = useLocation();
    const navigate = useNavigate();
    const complaintCode = location.state?.complaintCode || "N/A"; // fallback

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy!", err);
        });
    };


    return (
        <div className="w-full">
            <div className="border-2 border-gray-200 mx-auto flex flex-col items-center max-w-[1500px] w-[80%] px-10 py-5 rounded-lg mb-5 shadow-md">
                <h1 className="text-4xl font-bold bg-gradient-to-r py-5 from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
                    Thank you for submitting your complaint!
                </h1>
                <p className="-mt-4 mb-4 font-semibold text-xl italic text-gray-600">
                    Your report is helping make Iligan City better for everyone.
                </p>
                <p className="mt-4 text-xl font-semibold text-blue-400">Tracking ID:</p>
                <button 
                    className="flex flex-row items-center gap-3 w-70 h-20 my-3 px-6 py-2 bg-gray-200 rounded-lg font-bold text-lg transform transition duration-300 hover:scale-105"
                    onClick={(e) => handleCopy(e.target.innerText)}
                >
                    <Copy color={"#333333"}/>
                    {complaintCode}
                </button>

                <div>
                    <h1 className="font-bold mb-2">Instructions:</h1>

                    <div className="flex flex-row ml-5 text-sm">
                        <Check size={20} style={{ width: "23px", height: "23px", marginTop:"1px", paddingRight: "8px" }} />
                        <div>
                            <p>You can also check your email for the tracking ID.</p>
                        </div>
                    </div>

                    <div className="flex flex-row ml-5 text-sm">
                        <Check size={20} style={{ width: "23px", height: "23px", marginTop:"1px", paddingRight: "8px" }} />
                        <div className="flex flex-row gap-1">
                            <p>Your Tracking ID will be used to access the progress of your complaint.</p>
                            <a href="/track-complaint" className="text-blue-400 hover:underline">Track your complaint here.</a>
                        </div>
                    </div>

                    <div className="flex flex-row ml-5 text-sm">
                        <Check size={20} style={{ width: "23px", height: "23px", marginTop:"1px", paddingRight: "8px" }} />
                        <div className="flex flex-row gap-1">
                            <p>If you think there is a problem, reach out to us: </p>
                            <p className="text-blue-400 hover:underline">iReklamo@gmail.com</p>
                        </div>
                    </div>
                </div>

                <button
                    className="mt-6 px-6 py-2 my-4 bg-blue-400 rounded-lg text-white font-bold hover:bg-blue-500 transition"
                    onClick={() => navigate("/")}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}
