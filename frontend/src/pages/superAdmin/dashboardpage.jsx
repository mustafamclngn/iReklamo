import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUpIcon, NotebookPen, PencilLine, Eye, ScrollText } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from '../../components/navheaders/footer.jsx';
import useAuth from "../../hooks/useAuth.jsx";
import dashboardAPI from '../../api/dashboardAPI';

const CASE_TYPE_COLORS = {
    "Infrastructure & Utilities": "bg-red-500",
    "Environment & Sanitation": "bg-blue-500",
    "Peace & Order": "bg-green-500",
    "Government Service & Conduct": "bg-yellow-500",
    "Consumer & Business Complaints": "bg-purple-500",
    "Public Safety & Welfare": "bg-orange-500",
    "Others": "bg-gray-400",
};

const COLORS_PRIORITY = {
    'Urgent': '#FF0000',     // Red
    'Moderate': '#FFA500', // Orange
    'Low': '#0066FF',      // Blue
    'default': '#8884d8'   // default
};


const BC_DashboardPage = () => {
    return (
        <div>
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
                        <QuickActions /> 
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}


function ComplaintCountCards({ role, barangayId, userId }) { 
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const user = auth?.user; 
    

    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        overall: { Total: 0, Pending: 0, "In-Progress": 0, Resolved: 0 },
        past_month: { Total: 0, Pending: 0, "In-Progress": 0, Resolved: 0 },
    });

    useEffect(() => {
        if (!auth?.user || !auth?.roles) {
            console.log("Auth data not ready... waiting for AuthProvider.");
            return;
        }

        console.log("Auth data is ready. auth.user is:", auth.user);
        
        const fetchCounts = async () => {
            try {
                const userRole = auth.roles[0];
                const barangayId = auth.user.barangay_id;
                const userId = auth.user.user_id; 

                setLoading(true);
                
                console.log(`Fetching counts for: role=${userRole}, bgy_id=${barangayId}, user_id=${userId}`);

                const data = await dashboardAPI.getDashboardCounts(userRole, barangayId, userId);

                if (data) {
                    setCounts(data);
                } else {
                    console.error("No data received from API");
                }
            } catch (error) {
                console.error("Failed to fetch dashboard counts:", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchCounts();
        
    }, [auth.user, auth.roles]); 

    const cards = [
        { key: "Total", label: "Total Complaints", gradient: "from-[#0A2540] to-[#2563EB]" },
        { key: "Pending", label: "Pending Complaints", gradient: "from-[#450A0A] to-[#EF4444] to-[#2563EB]" },
        { key: "In-Progress", label: "In-Progress Complaints", gradient: "from-[#78350F] to-[#F59E0B]" },
        { key: "Resolved", label: "Resolved Complaints", gradient: "from-[#064E3B] to-[#10B981]" },
    ];

    const calcIncrease = (current, past) => {
        if (!past || past === 0) return "0%";
            const increase = ((current - past) / past) * 100;
        return `${increase.toFixed(1)}%`;
    };

    return (
        <div className='flex flex-row flex-wrap gap-3 justify-between'>
            {cards.map(card => (
                <button
                    key={card.key}
                    className='text-left'
                    onClick={() => navigate('/superadmin/complaints', {
                        state: { 
                            defaultStatus: card.key === 'Total' ? 'all' : card.key 
                        }
                    })
                  }
                >
                    <div className={`flex flex-col justify-between bg-gray-100 h-40 w-64 rounded-2xl p-5 hover:bg-gradient-to-br ${card.gradient} hover:text-white transition duration-300 ease-in-out`}>
                        <div className='flex flex-row justify-between items-center'>
                            <p className='font-semibold text-base'>{card.label}</p>
                            <div className='rounded-xl hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.5)] transition duration-200 ease-in-out'>
                                <ArrowUpRight size={25} color={'white'} strokeWidth={'1.25px'} style={{background:"black", borderRadius:"15px", padding:"3px"}}/>
                            </div>
                        </div>
                        <p className='font-bold text-5xl pb-2'>{loading ? "..." : counts.overall[card.key]}</p>
                        <div className='flex flex-row items-center gap-1 text-[13px]'>
                            <div className='flex flex-row items-center gap-[2px] border border-[#white] px-[5px] rounded'>
                                <p className='font-semibold -mt-[2px]'>{calcIncrease(counts.overall[card.key], counts.past_month[card.key])}</p>
                                <TrendingUpIcon size={13} />
                            </div>
                            <p className='italic'>increase from last month</p>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}


function ComplaintCountByCaseType() {
    const { auth } = useAuth(); 
    const [caseData, setCaseData] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth?.user || !auth?.roles) {
            return;
        }

        const fetchBreakdown = async () => {
            try {
                setLoading(true);
                const userRole = auth.roles[0];
                const barangayId = auth.user.barangay_id;
                const userId = auth.user.id; 

                const data = await dashboardAPI.getCaseTypeBreakdown(
                    userRole,
                    barangayId,
                    userId
                );

                setCaseData(data); 

            } catch (error) {
                console.error("Failed to fetch case breakdown:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBreakdown();
        
    }, [auth.user, auth.roles]);

    const maxValue = Math.max(0, ...caseData.map((d) => d.count));

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Complaint Count per Case Type</h2>

            <div className="space-y-3  max-h-[350px] overflow-y-scroll">
                {/* Handle Loading State */}
                {loading && <p className="text-gray-500">Loading data...</p>}

                {/* Handle No Data State */}
                {!loading && caseData.length === 0 && (
                    <p className="text-gray-500">No complaint data to display.</p>
                )}

                {/* Map over the LIVE caseData from the API */}
                {!loading && caseData.map((item) => {
                    // Find a color from our map, or use a default gray
                    const color = CASE_TYPE_COLORS[item.case_type] || "bg-gray-400";
                    
                    return (
                        <div key={item.case_type}> {/* Use case_type as key */}
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.case_type}</span>
                                <span className="text-sm text-gray-500">{item.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`${color} h-4 rounded-full transition-all duration-500`}
                                    style={{ width: maxValue === 0 ? '0%' : `${(item.count / maxValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


const ComplaintPieChart = () => {
    const { auth } = useAuth();
    const [priorityData, setPriorityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth?.user || !auth?.roles) {
            return; // Wait for auth
        }

        const fetchPriorityData = async () => {
            try {
                setLoading(true);
                const userRole = auth.roles[0];
                const barangayId = auth.user.barangay_id;
                const userId = auth.user.id; // Or auth.user.user_id

                // Just call the one API endpoint for priority
                const response = await dashboardAPI.getPriorityBreakdown(
                    userRole,
                    barangayId,
                    userId
                );

                setPriorityData(response); // API returns: [{ priority: "High", count: 2 }, ...]
                
            } catch (error) {
                console.error("Failed to fetch priority chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPriorityData();
    }, [auth.user, auth.roles]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2 flex justify-center items-center h-80">
                <p>Loading chart...</p>
            </div>
        );
    }
    
    if (!loading && priorityData.length === 0) {
        return (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2 flex justify-center items-center h-80">
                <p>No priority data to display.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Complaint Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Tooltip />
                    <Legend />

                    {/* A single Pie for Priority */}
                    <Pie
                        data={priorityData}
                        dataKey="count"
                        nameKey="priority" // This connects to your API data: { priority: "...", count: ... }
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60} // Set to 0 for a Pie, > 0 for a Donut
                        fill="#8884d8"
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {priorityData.map((entry, index) => (
                            <Cell 
                                key={`cell-priority-${index}`} 
                                // Get the color or use the default
                                fill={COLORS_PRIORITY[entry.priority] || COLORS_PRIORITY.default} 
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};



function QuickActions() {
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






export default BC_DashboardPage;