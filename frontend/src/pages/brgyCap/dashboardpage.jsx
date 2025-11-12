import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, TrendingUpIcon, NotebookPen, PencilLine, Eye, ScrollText, ShieldQuestionMark } from 'lucide-react';
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
    'Urgent': '#FF0000',    
    'Moderate': '#FFA500', 
    'Low': '#0066FF',
    'default': '#8884d8'
};


const BC_DashboardPage = () => {
    return (
        <div>
            <div className="w-full text-black my-10 flex justify-center items-center">
                <div className="relative w-[1591px] mx-10 flex justify-between gap-5">
                    <div className='flex flex-col w-3/4 gap-5'>
                        <ComplaintCountCards/>
                        <div className='flex flex-row gap-4'>
                            <ComplaintCountByCaseType/> 
                            <ComplaintPieChart />
                        </div>
                    </div>
                    <div className='flex flex-col w-1/4 gap-5'>
                        <UrgentComplaintsList />
                        <UnassignedOfficialsList />
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

        console.log("Auth data is ready. auth.user is:", auth);
        
        const fetchCounts = async () => {
            try {
                setLoading(true);
                const userRole = auth.role[0];
                const barangayId = auth.user.barangay_id;
                const userId = auth.user.user_id;

                const data = await dashboardAPI.getDashboardCounts(userRole, barangayId, userId);
                console.log("Dashboard Counts ", data )
                setCounts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
        
    }, [auth.user, auth.role]); 

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
                    onClick={() => navigate('/brgycap/complaints', {
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


function UnassignedOfficialsList() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUnassignedOfficials = async () => {
            try {
                setLoading(true);
                const userRole = auth.role[0];
                
                // --- IMPORTANT ---
                // We use the CAPTAIN's barangay_id to filter the list
                const barangayId = auth.user.barangay_id; 

                const data = await dashboardAPI.getUnassignedOfficials(userRole, barangayId);
                setOfficials(data);
                
            } catch (error) {
                console.error("Failed to fetch unassigned officials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnassignedOfficials();
    }, [auth.user, auth.role]);

    const handleViewDetails = (officialId) => {
        // Update this path to your "view official" page
        navigate(`/admin/officials/${officialId}`); 
    };

    const handleViewAll = () => {
        // Navigate to officials page with unassigned filter
        navigate('/brgycap/officials', {
            state: { defaultAssignment: 'unassigned' }
        });
    };

    return (
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
                    {/* --- DYNAMIC CONTENT --- */}
                    {loading && (
                        <tr>
                            <td colSpan="2" className="text-center py-4 text-gray-500">Loading...</td>
                        </tr>
                    )}

                    {!loading && officials.length === 0 && (
                        <tr>
                            <td colSpan="2" className="text-center py-4 text-gray-500">All officials have assigned cases.</td>
                        </tr>
                    )}

                    {!loading && officials.map((official) => (
                        <tr key={official.user_id} className="border-b border-gray-300 hover:bg-gray-50 text-sm text-gray-700 my-1">
                            <td className="max-w-[180px] truncate px-2 py-2">
                                {official.first_name} {official.last_name}
                            </td>
                            <td className="text-right px-2">
                                <button 
                                    onClick={() => handleViewDetails(official.user_id)}
                                    className="bg-gray-100 px-2 rounded-md font-semibold text-[13px] hover:bg-gray-300 transition"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* --- END DYNAMIC CONTENT --- */}
                </tbody>
            </table>

            <button 
                onClick={handleViewAll}
                className='bg-blue-500 border border-gray-300 w-full shadow rounded-md mt-5 py-1 text-white text-sm font-semibold items-center
                hover:shadow-md hover:bg-blue-800 all transition ease-in-out duration-200'
            >
                View all Unassigned Officials
            </button>
        </div>
    )
}


function UrgentComplaintsList() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [urgentComplaints, setUrgentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUrgentComplaints = async () => {
            try {
                setLoading(true);
                const userRole = auth.role[0];
                
                // --- IMPORTANT ---
                // Use the keys from your auth.user object!
                // (Based on our last chat, it's 'user_id' and 'barangay_id')
                // You must fix your login API to send these
                const barangayId = auth.user.barangay_id; 
                const userId = auth.user.user_id;

                const data = await dashboardAPI.getUrgentComplaints(userRole, barangayId, userId);
                setUrgentComplaints(data);
                
            } catch (error) {
                console.error("Failed to fetch urgent complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUrgentComplaints();
    }, [auth.user, auth.role]);

    // Navigate to the full complaints list, pre-filtered to "Urgent"
    const handleViewAllUrgent = () => {
        navigate('/brgycap/complaints', { // <-- Make sure this path is correct for brgy official
            state: { 
                defaultPriority: 'Urgent' // You'll need to implement this on your complaints page
            }
        });
    };

    // Navigate to a specific complaint's details page
    const handleViewDetails = (complaintId) => {
        navigate(`/brgycap/complaints/${complaintId}`); // <-- Adjust path as needed
    };

    return (
        <div className='flex flex-col gap-5'>
            <div className='p-5 border border-gray-200 shadow-md rounded-2xl max-h-[620px]'>
                <div className='flex flex-row items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-red-600 mb-6'/>
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>Urgent Complaints</h1>
                        <p className='italic text-gray-500 text-sm mb-3'>Most recent "Urgent" complaints</p>
                    </div>
                </div>

                <table className="max-h-[480px] overflow-y-scroll min-w-full border-collapse">
                    <thead className="border-b-2 border-gray-300">
                        <tr>
                            <th className="text-left text-sm font-semibold text-black uppercase px-2"> Complaint Title </th>
                            <th className="text-left text-sm font-semibold text-gray-700 uppercase"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* --- DYNAMIC CONTENT --- */}
                        {loading && (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-gray-500">Loading...</td>
                            </tr>
                        )}

                        {!loading && urgentComplaints.length === 0 && (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-gray-500">No urgent complaints found.</td>
                            </tr>
                        )}

                        {!loading && urgentComplaints.map((complaint) => (
                            <tr key={complaint.id} className="border-b border-gray-300 hover:bg-gray-50 text-sm text-gray-700 my-1">
                                <td className="max-w-[180px] truncate px-2 py-2" title={complaint.title}>
                                    {complaint.title}
                                </td>
                                <td className="text-right px-2">
                                    <button 
                                        onClick={() => handleViewDetails(complaint.id)}
                                        className="bg-gray-100 px-2 rounded-md font-semibold text-[13px] hover:bg-gray-300 transition"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button 
                    className='bg-blue-500 border border-gray-300 w-full shadow rounded-md mt-5 py-1 text-white text-sm font-semibold items-center
                    hover:shadow-md hover:bg-blue-800 all transition ease-in-out duration-200'
                    onClick={() => handleViewAllUrgent()}
                    >
                    View all Urgent Complaints
                </button>
            </div>
        </div>
    );
}

function ComplaintCountByCaseType() {
    const { auth } = useAuth(); 
    const [caseData, setCaseData] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBreakdown = async () => {
            try {
                setLoading(true);
                const userRole = auth.role[0];
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
        
    }, [auth.user, auth.role]);

    const maxValue = Math.max(0, ...caseData.map((d) => d.count));

    return (
        <div className="flex-1 p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-max">
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

        const fetchPriorityData = async () => {
            try {
                setLoading(true);
                const userRole = auth.role[0];
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
    }, [auth.user, auth.role]);

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
        <div className="flex-1 p-6 bg-white rounded-2xl border border-gray-200 shadow-md w-1/2 flex flex-col items-center">
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




export default BC_DashboardPage;