import React from 'react';
import { ArrowUpRight, TrendingUpIcon, CircleArrowRight, ShieldQuestionMark } from 'lucide-react';
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
                                <h1 className="text-4xl font-extrabold"> Maayong Adlaw, Kapitan! </h1>
                                <p className='italic'> Himoon nato karong adlawa nga usa ka produktibo nga adlaw </p>
                            </div>
                            <div className='flex flex-row gap-1 text-sm mt-3'>
                                <p className='font-semibold'>Barangay Captain:</p>
                                <p>Jose P. Rizzal</p>
                            </div>
                            <div className='flex flex-row text-sm gap-1'>
                                <p className='font-semibold'>Barangay: </p>
                                <p>Acmac</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full text-black my-10 flex justify-center items-center">
                <div className="relative w-[1591px] mx-10 flex justify-between gap-2">
                    <div className='flex flex-col w-3/4'>
                        <ComplaintCountCards/>
                        <ComplaintCountByCaseType/> 
                        <VerticalBarChart/>
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
    return (
        <div>
            {/* RIGHT */}
            <div>
                <div className='flex flex-row flex-wrap gap-3'>
                    {/* TOTAL COMPLAINTS */}
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
                    {/* PENDING */}
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
                    {/* IN-PROGRESS */}
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
                    {/* RESOLVED */}
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
                </div>
            </div>
        </div>
    )
}

function QuickView() {
    return (
        <div className='flex flex-col gap-5'>
            {/* URGENT COMPLAINTS */}
            <div className='p-5 border border-gray-200 shadow-md rounded-2xl'>
                <div className='flex flex-row items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-red-600 mb-6'/>
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>Urgent Complaints</h1>
                        <p className='italic text-gray-500 text-sm mb-3'>High-priority complaints</p>
                    </div>
                </div>
                <table className="min-w-full border-collapse">
                    <thead className="border-b-2 border-gray-300">
                        <tr>
                            <th className="text-left text-sm font-semibold text-black uppercase px-2"> Complaint Title </th>
                            <th className="text-left text-sm font-semibold text-gray-700 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300 hover:bg-gray-50 text-sm text-gray-700 my-1">
                            <td className="max-w-[180px] truncate px-2"> Jose Rizal ang pinakagwapo na mother sa munder </td>
                            <td className="text-right px-2">
                                <button className="px-2 rounded-md font-semibold text-[13px] hover:bg-gray-300 transition">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button 
                    className='border border-gray-300 w-full shadow rounded-md mt-5 py-1 text-sm font-semibold items-center
                    hover:bg-gray-100 transition ease-in-out duration-200'
                    >
                    View all Complaints
                </button>
            </div>

            {/* UNASSIGNED OFFICIALS */}
            <div className='p-5 border border-gray-200 shadow-md rounded-2xl'>
                <div className='flex flex-row items-center gap-1'>
                    <div className='mb-7'>
                        <ShieldQuestionMark size={20} color={'#2563EB'}/>
                    </div>
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>Unassigned Officials</h1>
                        <p className='italic text-gray-500 text-sm mb-3'>No cases handled</p>
                    </div>
                </div>
                <table className="min-w-full border-collapse">
                    <thead className="border-b-2 border-gray-300">
                        <tr>
                            <th className="text-left text-sm font-semibold text-black uppercase px-2"> Name of Official </th>
                            <th className="text-left text-sm font-semibold text-gray-700 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300 hover:bg-gray-50 text-sm text-gray-700 my-1">
                            <td className="max-w-[180px] truncate px-2">Padre Damaso Jr.</td>
                            <td className="text-right px-2">
                                <button className="px-2 rounded-md font-semibold text-[13px] hover:bg-gray-300 transition">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button 
                    className='border border-gray-300 w-full shadow rounded-md mt-5 py-1 text-sm font-semibold items-center
                    hover:b g-gray-100 transition ease-in-out duration-200'
                    >
                    View all Officials
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
        <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-lg mx-auto">
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

function VerticalBarChart() {
  const data = [
    { label: "Pending", value: 10, color: "red" },
    { label: "In Progress", value: 6, color: "blue" },
    { label: "Resolved", value: 15, color: "green" },
    { label: "Total", value: 25, color: "yellow" },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  // Map color names to Tailwind classes
  const colorClasses = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-gray-700 mb-6 text-center">
        Complaint Count per Case Type
      </h2>

      <div className="flex items-end justify-between h-64 px-4 space-x-6">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center w-full">
            <div className="w-10 bg-gray-200 rounded-t-lg overflow-hidden flex items-end h-full">
              <div
                className={`${colorClasses[item.color]} w-10 rounded-t-lg transition-all duration-500`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700 mt-2">
              {item.label}
            </span>
            <span className="text-xs text-gray-500">{item.value}</span>
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
        { name: "Total", value: 30 },
    ];

    const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308"]; // red, blue, green, yellow

    return(
        <div className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
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