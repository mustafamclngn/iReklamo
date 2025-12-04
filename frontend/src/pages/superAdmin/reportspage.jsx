import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartNoAxesColumn, Ellipsis, HandHelping, Megaphone, MessageCircleMore, Pin, SquareStack, SquareStar } from 'lucide-react';
import '/src/assets/css/eventcard.css';
import useUserInfoApi from '../../api/userInfo';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportsPage() {
    const [barangays, setBarangays] = useState([]);
    const { getBarangays } = useUserInfoApi();

    useEffect(() => {
        const fetchBarangays = async () => {
            try {
                const data = await getBarangays();
                setBarangays(data);
            } catch (error) {
                console.error('Failed to fetch barangays:', error);
            }
        };
        fetchBarangays();
    }, []);
    
    return (
        <div className='flex flex-row w-full h-full p-4 gap-4'> 

            {/* Left area */}
            <div className=' w-3/4'>
                {/* TOP ANALYTICS */}
                <div className='flex flex-row gap-3'>
                    <div className='w-1/3 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <AnnualComplaintCount />
                    </div>  

                    <div className='w-1/3 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <LeadingCaseType />
                    </div>  

                    <div className='w-1/3 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <DailyComplaints />
                    </div>  
                </div>


                {/* MIDDLE ANALYTICS */}
                <div className='flex flex-row gap-3 mt-3'>
                    <div className='w-1/2 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <CaseTypeBreakdownperBrgy barangays={barangays} />
                    </div>
                    <div className='w-1/2 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <ResolvedComplaintsperBrgy />
                    </div>
                </div>
            </div>

            {/* Right area */}
            <div className='w-1/4'>
                <div className='-mt-2'>
                    <BasicDateCalendar />
                </div>

                {/* Announcements */}
                <div className='mt-4 border-[1px] border-gray-200 rounded-md px-5 py-6'>
                    <div className='flex flex-row justify-between'>
                        <h1 className='text-xl font-semibold mb-5'>
                            <Megaphone size={20} strokeWidth={'2.25px'} className='inline-block mr-2'/>
                            Announcements
                        </h1>
                        <Ellipsis size={20} strokeWidth={'2.25px'} className='mt-1' color={'gray'}/>
                    </div>

                    <div>
                        <AnnouncementCard 
                            author='Councilor J.A. Perez' 
                            logo={<MessageCircleMore size={15} strokeWidth={'2.25px'} />} 
                            category="General" 
                            title="Council Meeting" 
                            details="All councilors are requested to attend the meeting this Friday at 3PM in the session hall." 
                        />
                        
                        <div className='bg-gray-400 h-[1px] w-full my-7'/>
                        
                        <AnnouncementCard 
                            author='Mayor S. Rodriguez' 
                            logo={<HandHelping size={15} strokeWidth={'2.25px'} />} 
                            category="Community Service" 
                            title="Outreach Program at Brgy. San Miguel" 
                            details="All councilors are requested to attend the meeting this Friday at 3PM in the session hall." 
                        />
                        
                        <div className='bg-gray-400 h-[1px] w-full my-7'/>
                        
                        <AnnouncementCard 
                            author='Councilor J.A. Perez' 
                            logo={<MessageCircleMore size={15} strokeWidth={'2.25px'}/>} 
                            category="General" 
                            title="Council Meeting" 
                            details="All councilors are requested to attend the meeting this Friday at 3PM in the session hall." 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


function ResolvedComplaintsperBrgy(){
    const barangayData = [
        { barangay: 'Abuno' },
        { barangay: 'Acmac-Mariano Badelles Sr.' },
        { barangay: 'Bagong Silang' },
        { barangay: 'Bonbonon' },
        { barangay: 'Bunawan' },
        { barangay: 'Buru-un' },
        { barangay: 'Dalipuga' },
        { barangay: 'Del Carmen' },
        { barangay: 'Digkilaan' },
        { barangay: 'Ditucalan' },
        { barangay: 'Dulag' },
        { barangay: 'Hinaplanon' },
        { barangay: 'Hindang' },
        { barangay: 'Kabacsanan' },
        { barangay: 'Kalilangan' },
        { barangay: 'Kiwalan' },
        { barangay: 'Lanipao' },
        { barangay: 'Luinab' },
        { barangay: 'Mahayahay' },
        { barangay: 'Mainit' },
        { barangay: 'Mandulog' },
        { barangay: 'Maria Cristina' },
        { barangay: 'Pala-o' },
        { barangay: 'Panoroganan' },
        { barangay: 'Poblacion' },
        { barangay: 'Puga-an' },
        { barangay: 'Rogongon' },
        { barangay: 'San Miguel' },
        { barangay: 'San Roque' },
        { barangay: 'Santa Elena' },
        { barangay: 'Santa Filomena' },
        { barangay: 'Santiago' },
        { barangay: 'Santo Rosario' },
        { barangay: 'Saray' },
        { barangay: 'Suarez' },
        { barangay: 'Tambacan' },
        { barangay: 'Tibanga' },
        { barangay: 'Tipanoy' },
        { barangay: 'Tomas Cabili (Tominobo Proper)' },
        { barangay: 'Upper Hinaplanon' },
        { barangay: 'Upper Tominobo' },
        { barangay: 'Villa Verde' },
        { barangay: 'Bonifacio' },
        { barangay: 'Ubaldo Laya' }
    ];

    const caseTypes = [
        {
            label: 'Resolved',
            data: [
            45, 32, 38, 22, 30, 50, 42, 27, 35, 29, 31, 44, 36, 28, 34, 40,
            33, 41, 39, 26, 24, 37, 48, 46, 55, 20, 23, 47, 52, 49, 43, 34,
            36, 38, 29, 41, 50, 44, 33, 39, 31, 26, 28, 35
            ],
            color: '#3b82f6'
        },
        {
            label: 'Pending',
            data: [
            28, 22, 25, 20, 18, 30, 27, 19, 24, 21, 23, 29, 26, 20, 22, 28,
            25, 31, 27, 19, 17, 26, 32, 29, 35, 16, 18, 31, 34, 30, 28, 24,
            26, 27, 22, 29, 33, 28, 23, 27, 25, 20, 21, 24
            ],
            color: '#10b981'
        },
        {
            label: 'In-Progress',
            data: [
            28, 22, 25, 20, 18, 30, 27, 19, 24, 21, 23, 29, 26, 20, 22, 28,
            25, 31, 27, 19, 17, 26, 32, 29, 35, 16, 18, 31, 34, 30, 28, 24,
            26, 27, 22, 29, 33, 28, 23, 27, 25, 20, 21, 24
            ],
            color: '#f59e0b'
        }
    ];

    

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Monthly Case Type Breakdown per Barangay</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        {MONTHS.map((month, idx) => (
                            <option key={idx} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className='mt-4'>
                    <BarChart
                        height={250}
                        series={caseTypes.map(ct => ({
                            data: ct.data,
                            label: ct.label,
                            stack: 'total',
                            color: ct.color,
                        }))}
                        xAxis={[{
                            scaleType: 'band',
                            data: barangayData.map(b => b.barangay),
                            tickLabelStyle: {
                                fontSize: 11,
                                angle: -15,
                                textAnchor: 'end',
                            },
                        }]}
                        margin={0}
                        sx={{
                            '.MuiChartsLegend-root': {
                                display: 'none',
                            },
                        }}
                    />
                </div>

                {/* Legend */}
                <div className='flex flex-wrap gap-3 text-xs justify-center'>
                    {caseTypes.map((ct, idx) => (
                        <div key={idx} className='flex items-center gap-1 justify-center'>
                            <div 
                                className='w-3 h-3 rounded-sm' 
                                style={{ backgroundColor: ct.color }}
                            />
                            <span className='text-gray-700'>{ct.label}</span>
                        </div>
                    ))}
                </div>

                {/* STATS */}
                <div className="mt-6 flex flex-row rounded-2xl border ">
  
                    {/* LEFT CARD */}
                    <div className="bg-white p-4 rounded-l-2xl w-1/3">
                        <div className="flex flex-col gap-5">
                            <div className='items-center flex flex-col justify-center'>
                                <p className="text-sm text-gray-500 font-medium text-center">
                                    Avg. Resolution Time (Monthly)
                                </p>

                                <select className='w-full border rounded-xl text-xs text-gray-500 mt-2 p-1'>
                                    {barangayData.map((barangay, idx) => (
                                        <option key={idx} value={barangay.barangay}>{barangay.barangay}</option>
                                    ))}
                                </select>

                                <h2 className="text-3xl font-bold text-gray-900 mt-5 text-center">3.3 days</h2>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="bg-white border-l rounded-r-2xl p-4 w-2/3">
                        
                        {/* Header */}
                        <p className="text-sm text-gray-500 font-medium mb-4">
                            Performance Highlights
                        </p>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Highest Resolved Cases
                            </p>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Barangay Poblacion — 55 cases
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">
                                Lowest Resolved Cases
                            </p>
                            <div className='flex flex-row justify-between items-center'>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Barangay Abuno
                                </h2>
                                <h2 className='bg-blue-500'>4 cases</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




function CaseTypeBreakdownperBrgy(){
    const barangayData = [
        { barangay: 'Abuno' },
        { barangay: 'Acmac-Mariano Badelles Sr.' },
        { barangay: 'Bagong Silang' },
        { barangay: 'Bonbonon' },
        { barangay: 'Bunawan' },
        { barangay: 'Buru-un' },
        { barangay: 'Dalipuga' },
        { barangay: 'Del Carmen' },
        { barangay: 'Digkilaan' },
        { barangay: 'Ditucalan' },
        { barangay: 'Dulag' },
        { barangay: 'Hinaplanon' },
        { barangay: 'Hindang' },
        { barangay: 'Kabacsanan' },
        { barangay: 'Kalilangan' },
        { barangay: 'Kiwalan' },
        { barangay: 'Lanipao' },
        { barangay: 'Luinab' },
        { barangay: 'Mahayahay' },
        { barangay: 'Mainit' },
        { barangay: 'Mandulog' },
        { barangay: 'Maria Cristina' },
        { barangay: 'Pala-o' },
        { barangay: 'Panoroganan' },
        { barangay: 'Poblacion' },
        { barangay: 'Puga-an' },
        { barangay: 'Rogongon' },
        { barangay: 'San Miguel' },
        { barangay: 'San Roque' },
        { barangay: 'Santa Elena' },
        { barangay: 'Santa Filomena' },
        { barangay: 'Santiago' },
        { barangay: 'Santo Rosario' },
        { barangay: 'Saray' },
        { barangay: 'Suarez' },
        { barangay: 'Tambacan' },
        { barangay: 'Tibanga' },
        { barangay: 'Tipanoy' },
        { barangay: 'Tomas Cabili (Tominobo Proper)' },
        { barangay: 'Upper Hinaplanon' },
        { barangay: 'Upper Tominobo' },
        { barangay: 'Villa Verde' },
        { barangay: 'Bonifacio' },
        { barangay: 'Ubaldo Laya' }
    ];

    const caseTypes = [
    {
        label: 'Peace & Order',
        data: [
        45, 32, 38, 22, 30, 50, 42, 27, 35, 29, 31, 44, 36, 28, 34, 40,
        33, 41, 39, 26, 24, 37, 48, 46, 55, 20, 23, 47, 52, 49, 43, 34,
        36, 38, 29, 41, 50, 44, 33, 39, 31, 26, 28, 35
        ],
        color: '#3b82f6'
    },
    {
        label: 'Env & Sanitation',
        data: [
        28, 22, 25, 20, 18, 30, 27, 19, 24, 21, 23, 29, 26, 20, 22, 28,
        25, 31, 27, 19, 17, 26, 32, 29, 35, 16, 18, 31, 34, 30, 28, 24,
        26, 27, 22, 29, 33, 28, 23, 27, 25, 20, 21, 24
        ],
        color: '#10b981'
    },
    {
        label: 'Consumer',
        data: [
        18, 15, 17, 14, 13, 20, 19, 12, 16, 15, 17, 18, 16, 14, 15, 19,
        17, 21, 20, 14, 13, 18, 22, 19, 24, 11, 12, 21, 23, 22, 19, 16,
        18, 17, 15, 20, 23, 19, 16, 18, 17, 14, 15, 16
        ],
        color: '#f59e0b'
    },
    {
        label: 'Health',
        data: [
        14, 18, 12, 10, 9, 20, 17, 11, 13, 12, 15, 16, 14, 10, 12, 18,
        15, 19, 17, 11, 10, 16, 21, 18, 22, 9, 10, 20, 23, 19, 16, 13,
        15, 14, 12, 17, 21, 18, 14, 16, 13, 11, 12, 14
        ],
        color: '#ef4444'
    },
    {
        label: 'Infrastructure',
        data: [
        25, 20, 22, 18, 17, 30, 28, 19, 24, 21, 23, 27, 25, 18, 21, 29,
        26, 31, 28, 20, 19, 27, 33, 30, 35, 17, 19, 32, 36, 31, 27, 23,
        25, 26, 21, 28, 34, 30, 24, 27, 22, 19, 20, 23
        ],
        color: '#8b5cf6'
    },
    {
        label: 'Education',
        data: [
        10, 12, 15, 9, 8, 18, 16, 7, 11, 10, 12, 14, 13, 9, 11, 17,
        14, 18, 16, 8, 7, 15, 19, 16, 21, 6, 7, 20, 22, 18, 14, 12,
        13, 14, 10, 16, 20, 17, 12, 14, 11, 9, 10, 12
        ],
        color: '#ec4899'
    },
    {
        label: 'Others',
        data: [
        8, 10, 9, 7, 6, 12, 11, 6, 8, 7, 9, 10, 9, 6, 7, 11,
        9, 13, 12, 6, 5, 10, 14, 11, 15, 4, 5, 13, 16, 12, 10, 8,
        9, 9, 7, 11, 14, 12, 8, 10, 7, 6, 7, 8
        ],
        color: '#6b7280'
    }
    ];

    

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Monthly Case Type Breakdown per Barangay</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        {MONTHS.map((month, idx) => (
                            <option key={idx} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className='mt-4'>
                    <BarChart
                        height={250}
                        series={caseTypes.map(ct => ({
                            data: ct.data,
                            label: ct.label,
                            stack: 'total',
                            color: ct.color,
                        }))}
                        xAxis={[{
                            scaleType: 'band',
                            data: barangayData.map(b => b.barangay),
                            tickLabelStyle: {
                                fontSize: 11,
                                angle: -15,
                                textAnchor: 'end',
                            },
                        }]}
                        margin={0}
                        sx={{
                            '.MuiChartsLegend-root': {
                                display: 'none',
                            },
                        }}
                    />
                </div>

                {/* Legend */}
                <div className='flex flex-wrap gap-3 text-xs justify-center'>
                    {caseTypes.map((ct, idx) => (
                        <div key={idx} className='flex items-center gap-1 justify-center'>
                            <div 
                                className='w-3 h-3 rounded-sm' 
                                style={{ backgroundColor: ct.color }}
                            />
                            <span className='text-gray-700'>{ct.label}</span>
                        </div>
                    ))}
                </div>

                <div>
                    EXPLANATION
                </div>
            </div>
        </div>
    );
}



// TO FIX
function DailyComplaints() {
    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Daily Complaints</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                        <option>All time</option>
                    </select>
                </div>

            </div>

        </div>
    );
} 


function LeadingCaseType() {
    const caseData = [
        { case: 'Peace & Order', count: 156 },
        { case: 'Environment & Sanitation', count: 132 },
        { case: 'Consumer & Business Complaints', count: 98 },
    ];

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Annual Leading 3 Case Types</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                        <option>All time</option>
                    </select>
                </div>

                <div className='mt-2'>
                    {caseData.map((item, index) => (
                        <div key={index} className='flex items-center mb-3 gap-2'>
                            <div className='w-1/3 truncate text-sm font-medium text-gray-700 -mb-2'>
                                {item.case}
                            </div>
                            <div className='w-2/3'>
                                <div className='bg-gray-200 rounded-full h-5 -mb-2 overflow-hidden '>
                                    <div 
                                        className='bg-blue-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold rounded-full transition-all duration-300'
                                        style={{ width: `${(item.count / 200) * 100}%` }}
                                    >
                                        {item.count}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 


function AnnouncementCard({logo, category, title, details}) {
    return (
        <div>
            <div className='flex flex-row items-center justify-between mb-4'>
                <div>
                    <h1 className='font-semibold text-lg leading-none'>{title}</h1>
                    <div className='flex flex-row items-center italic text-sm text-gray-600 gap-1'>
                        <div className='inline-block'>{logo}</div><div>{category}</div>
                    </div>
                </div>
                <div className='flex flex-row gap-1 items-center bg-gray-200 rounded-2xl px-2 py-1 pr-3 text-xs'>
                    <Pin size={15} strokeWidth={'2.25px'} className='inline-block mt-1' />
                    <h1>Pinned</h1>
                </div>
            </div>
            <p className='leading-none'>{details}</p>
        </div>
    );
}


function BasicDateCalendar() {
    return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='flex flex-row bg-gray-100 border border-gray-300 shadow rounded-md mt-2 px-5 py-3 text-sm gap-5 justify-center items-center
                    hover:bg-gray-200 transition ease-in-out duration-200'>
                    <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
                </div>
            </LocalizationProvider>
    );
}


function AnnualComplaintCount() {
    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Annual Total Complaints</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                        <option>All time</option>
                    </select>
                </div>
                <div className='flex flex-row justify-between'>
                    <h2 className="event-value">1.2k</h2>
                    <div className="event-chart">
                        <LineChart
                            height={80}
                            series={[
                                {
                                    data: [40, 30, 45, 35, 50, 45, 60, 55, 70, 60, 65, 55],
                                    showMark: false,
                                    color: '#2563eb',
                                    area: true,
                                },
                            ]}
                            xAxis={[{ scaleType: 'point', data: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], hide: true }]}
                            yAxis={[{ min: 0, max: 100, hide: true }]}
                            margin={0}
                            sx={{
                                '.MuiChartsAxis-root': { display: 'none' },
                                '.MuiChartsGrid-root': { display: 'none' },
                                '.MuiAreaElement-root': {
                                    fill: 'url(#eventGradient)',
                                },
                            }}
                        >
                            <defs>
                                <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </div>
                </div>
            </div>

        </div>
    );
} 

