import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUpIcon, CircleArrowRight, ShieldQuestionMark, NotebookPen, PencilLine, Eye, ScrollText } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const BC_DashboardPage = () => {
    return (
        <div>
            {/* HEADER */}
            <section className="w-full text-white my-10 flex justify-center items-center">
                <div
                    className="relative w-[1591px] h-44 mx-10 px-10 py-10 flex justify-between items-center rounded-2xl bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: "url('/images/fordashboard/waterfalls.jpg')", }}
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 to-[#1b4f57]/90 rounded-2xl" />

                    {/* Content (above overlay) */}
                    <div className="flex flex-col relative z-10 flex w-full">
                        <div>
                            <div>
                                <h1 className="text-4xl font-extrabold"> Maayong Adlaw, Admin! </h1>
                                <p className='italic'> Himoon nato karong adlawa nga usa ka produktibo nga adlaw </p>
                            </div>
                            <div className='flex flex-row gap-1 text-sm mt-3'>
                                <p className='font-semibold'>Admin:</p>
                                <p>Jose P. Rizzal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full text-black my-10 flex justify-center items-center">
                <div className="relative w-[1591px] mx-10 flex justify-between gap-5">
                    <div className='flex flex-col w-3/4'>
                        <ComplaintCountCards/>
                        <div className='flex flex-row mt-5 gap-5'>
                            <ComplaintCountByCaseType/>
                            <ComplaintPieChart />
                        </div>
                    </div>
                    <div className='w-1/4'>
                        <QuickView /> 
                    </div>
                </div>
            </div>
        </div>
    );
}


function ComplaintCountCards() {
    const navigate = useNavigate();

    return (
        <div>
            {/* RIGHT */}
            <div>
                <div className='flex flex-row flex-wrap gap-3 justify-between'>
                    {/* TOTAL COMPLAINTS */}
                    <button className='text-left' onClick={() => navigate('/superadmin/complaints')}>
                        <div className='flex flex-col justify-between bg-gray-100 h-40 w-64 rounded-2xl p-5 hover:bg-gradient-to-br from-[#0A2540] to-[#2563EB] hover:text-white transition duration-300 ease-in-out'>
                            <div className='flex flex-row justify-between items-center'>
                                <p className='font-semibold text-base'>Total Complaints</p>
                                <div className='rounded-xl hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.5)] transition duration-200 ease-in-out'>
                                    <ArrowUpRight size={25} color={'white'} strokeWidth={'1.25px'} style={{background:"black", borderRadius:"15px", padding:"3px"}}/>
                                </div>
                            </div>
                            <p className='font-bold text-5xl pb-2'>33</p>
                            <div className='flex flex-row items-center gap-1 text-[13px]'>
                                <div className='flex flex-row items-center gap-[2px] border border-[#white] px-[5px] rounded'>
                                    <p className='font-semibold -mt-[2px]'>5</p>
                                    <TrendingUpIcon size={13} />
                                </div>
                                <p className='italic'>increase from last month</p>
                            </div>
                        </div>
                    </button>

                    {/* PENDING */}
                    <button className='text-left' onClick={() => navigate('/superadmin/complaints')}>
                        <div className='flex flex-col justify-between bg-gray-100 h-40 w-64 rounded-2xl p-5 hover:bg-gradient-to-br from-[#450A0A] to-[#EF4444] to-[#2563EB] hover:text-white transition duration-300 ease-in-out'>
                            <div className='flex flex-row justify-between items-center'>
                                <p className='font-semibold text-base'>Pending Complaints</p>
                                <div className='rounded-xl hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.5)] transition duration-200 ease-in-out'>
                                    <ArrowUpRight size={25} color={'white'} strokeWidth={'1.25px'} style={{background:"black", borderRadius:"15px", padding:"3px"}}/>
                                </div>
                            </div>
                            <p className='font-bold text-5xl pb-2'>33</p>
                            <div className='flex flex-row items-center gap-1 text-[13px]'>
                                <div className='flex flex-row items-center gap-[2px] border border-[#white] px-[5px] rounded'>
                                    <p className='font-semibold -mt-[2px]'>5</p>
                                    <TrendingUpIcon size={13} />
                                </div>
                                <p className='italic'>increase from last month</p>
                            </div>
                        </div>
                    </button>

                    {/* IN-PROGRESS */}
                    <button className='text-left' onClick={() => navigate('/superadmin/complaints')}>
                        <div className='flex flex-col justify-between bg-gray-100 h-40 w-64 rounded-2xl p-5 hover:bg-gradient-to-br from-[#78350F] to-[#F59E0B] hover:text-white transition duration-300 ease-in-out'>
                            <div className='flex flex-row justify-between items-center'>
                                <p className='font-semibold text-base'>In-progress Complaints</p>
                                <div className='rounded-xl hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.5)] transition duration-200 ease-in-out'>
                                    <ArrowUpRight size={25} color={'white'} strokeWidth={'1.25px'} style={{background:"black", borderRadius:"15px", padding:"3px"}}/>
                                </div>
                            </div>
                            <p className='font-bold text-5xl pb-2'>33</p>
                            <div className='flex flex-row items-center gap-1 text-[13px]'>
                                <div className='flex flex-row items-center gap-[2px] border border-[#white] px-[5px] rounded'>
                                    <p className='font-semibold -mt-[2px]'>5</p>
                                    <TrendingUpIcon size={13} />
                                </div>
                                <p className='italic'>increase from last month</p>
                            </div>
                        </div>
                    </button>
                    
                    {/* RESOLVED */}
                    <button className='text-left' onClick={() => navigate('/superadmin/complaints')}>
                        <div className='flex flex-col justify-between bg-gray-100 h-40 w-64 rounded-2xl p-5 hover:bg-gradient-to-br from-[#064E3B] to-[#10B981] hover:text-white transition duration-300 ease-in-out'>
                            <div className='flex flex-row justify-between items-center'>
                                <p className='font-semibold text-base'>Resolved Complaints</p>
                                <div className='rounded-xl hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.5)] transition duration-200 ease-in-out'>
                                    <ArrowUpRight size={25} color={'white'} strokeWidth={'1.25px'} style={{background:"black", borderRadius:"15px", padding:"3px"}}/>
                                </div>
                            </div>
                            <p className='font-bold text-5xl pb-2'>33</p>
                            <div className='flex flex-row items-center gap-1 text-[13px]'>
                                <div className='flex flex-row items-center gap-[2px] border border-[#white] px-[5px] rounded'>
                                    <p className='font-semibold -mt-[2px]'>5</p>
                                    <TrendingUpIcon size={13} />
                                </div>
                                <p className='italic'>increase from last month</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

function QuickView() {
    const navigate = useNavigate();
    
    return (
        <div className='flex flex-col gap-5'>

            {/* UNASSIGNED OFFICIALS */}
            <div className='p-5 border border-gray-200 shadow-md rounded-2xl'>
                <div className='flex flex-row items-center gap-1'>
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>Quick Actions</h1>
                        <p className='italic text-gray-500 text-sm mb-3'>Management</p>
                    </div>
                </div>

                <button className='flex flex-row bg-gray-100 border border-gray-300 w-full shadow rounded-md mt-2 px-5 py-3 text-sm gap-5 justify-center items-center
                    hover:bg-gray-200 transition ease-in-out duration-200'
                    onClick={() => navigate('/superadmin/officials')}
                >
                    <PencilLine size={40} strokeWidth={'2.25px'}/>
                    <div className='text-start'>
                        <p className='font-semibold text-base'>Create Official Account</p>
                        <p className='text-[12px] leading-tight text-gray-500 italic'>Add accounts for city admin, barangay officials, and barangay kagawads.</p>
                    </div>
                </button>

                <button className='flex flex-row bg-gray-100 border border-gray-300 w-full shadow rounded-md mt-3 px-5 py-3 text-sm gap-5 justify-center items-center
                    hover:bg-gray-200 transition ease-in-out duration-200'
                    onClick={() => navigate('/superadmin/complaints')}
                >
                    <ScrollText size={40} strokeWidth={'2.25px'}/>
                    <div className='text-start'>
                        <p className='font-semibold text-base'>View all Complaints</p>
                        <p className='text-[12px] text-gray-500 leading-tight italic'>Access the list of all complaints from all barangays within Iligan City.</p>
                    </div>
                </button>

                <button className='flex flex-row bg-gray-100 border border-gray-300 w-full shadow rounded-md mt-3 px-5 py-3 text-sm gap-5 justify-center items-center
                    hover:bg-gray-200 transition ease-in-out duration-200'
                    onClick={() => navigate('/superadmin/barangays')}
                >
                    <ScrollText size={28} strokeWidth={'2.25px'}/>
                    <div className='text-start'>
                        <p className='font-semibold text-base'>View all Barangays</p>
                        <p className='text-[12px] leading-tight text-gray-500 italic'>Access the list of all barangays within Iligan City.</p>
                    </div>
                </button>
            </div>
        </div>
    )
}


function ComplaintCountByCaseType() {
    const data = [
        { label: "Pending", value: 10, color: "bg-red-500" },
        { label: "In Progress", value: 6, color: "bg-blue-500" },
        { label: "Resolved", value: 15, color: "bg-green-500" },
        { label: "Total", value: 25, color: "bg-yellow-500" },
    ];

    // find max for scaling
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Complaint Count per Case Type</h2>

            <div className="space-y-3">
                {data.map((item) => (
                <div key={item.label}>
                    <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className={`${item.color} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}


function ComplaintPieChart() {
    const data = [
        { name: "Pending", value: 10 },
        { name: "In Progress", value: 5 },
        { name: "Resolved", value: 15 },
    ];

    const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308"]; // red, blue, green, yellow

    return(
        <div className="flex flex-col items-center bg-white border border-gray-200 shadow-md rounded-2xl p-6 w-1/2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Complaint Status Overview</h2>
            <PieChart width={300} height={300}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    )
}


export default BC_DashboardPage;