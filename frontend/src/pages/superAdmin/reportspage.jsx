import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { Ellipsis, HandHelping, Megaphone, MessageCircleMore, Pin, TrendingUp, TrendingDown, Star, AlertOctagon, AlertTriangle, CheckCircle, CircleCheck } from 'lucide-react';
import '/src/assets/css/eventcard.css';
import useUserInfoApi from '../../api/userInfo';
import reportsAPI from '../../api/reportsAPI';

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
                const response = await getBarangays();
                console.log('Fetched barangays data:', response);
                // Extract the data array from the response object
                const barangayList = response.data || response;
                console.log('Barangay list:', barangayList);
                console.log('Is array?', Array.isArray(barangayList));
                setBarangays(barangayList);
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
                        <SatisfactionLevel />
                    </div>  
                </div>


                {/* MIDDLE ANALYTICS */}
                <div className='flex flex-row gap-3 mt-3'>
                    <div className='w-1/2 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <CaseTypeBreakdownperBrgy barangays={barangays} />
                    </div>
                    <div className='w-1/2 border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <ResolvedComplaintsperBrgy barangays={barangays} />
                    </div>
                </div>

                {/* BOTTOM ANALYTICS */}
                <div className='flex flex-row gap-3 mt-3'>
                    <div className='w-full border-[1px] border-gray-200 p-4 rounded-2xl shadow-md bg-white'>
                        <UrgentBarangays />
                    </div>
                </div>
            </div>

            {/* Right area */}
            <div className='w-1/4'>
                <div className='-mt-2'>
                    <BasicDateCalendar />
                </div>

                {/* Announcements */}
                <div className='mt-4 border border-gray-200 shadow-md rounded-2xl px-5 py-4'>
                    <div className='flex flex-row justify-between'>
                        <h1 className='text-xl font-semibold'>
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
                        
                        <AnnouncementCard 
                            author='Mayor S. Rodriguez' 
                            logo={<HandHelping size={15} strokeWidth={'2.25px'} />} 
                            category="Community Service" 
                            title="Outreach Program at Brgy. San Miguel" 
                            details="All councilors are requested to attend the meeting this Friday at 3PM in the session hall." 
                        />
                        
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





function CaseTypeBreakdownperBrgy(){
    const currentDate = new Date();
    const currentMonth = MONTHS[currentDate.getMonth()];
    
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [caseTypes, setCaseTypes] = useState([]);
    const [barangayData, setBarangayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topMonthlyTypes, setTopMonthlyTypes] = useState([]);

    const mainColors = {
        'Infrastructure & Utilities': '#3b82f6',
        'Environment & Sanitation': '#10b981',
        'Peace & Order': '#f59e0b',
        'Government Service & Conduct': '#ef4444',
        'Consumer & Business Complaints': '#8b5cf6',
        'Public Safety & Welfare': '#ec4899'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await reportsAPI.getMonthlyCaseTypePerBarangay(selectedMonth, '2025');
                
                console.log('Fetched data for', selectedMonth, ':', data);
                
                // Check if we have valid data
                if (!data || !data.case_types || data.case_types.length === 0) {
                    console.log('No case types found for', selectedMonth);
                    setCaseTypes([]);
                    setBarangayData([]);
                    setTopMonthlyTypes([]);
                    setLoading(false);
                    return;
                }

                // Transform data for the chart
                const chartSeries = data.case_types.map((caseType, idx) => ({
                    label: caseType,
                    data: data.barangays.map(b => b.case_type_counts[idx] || 0),
                    color: mainColors[caseType] || '#6b7280' // Gray for others
                }));

                setCaseTypes(chartSeries);
                setBarangayData(data.barangays.map(b => b.barangay_name));
                
                // Calculate totals for each case type across all barangays for Top 3
                const typeTotals = data.case_types.map((caseType, idx) => {
                    const total = data.barangays.reduce((sum, b) => sum + (b.case_type_counts[idx] || 0), 0);
                    return { case_type: caseType, count: total };
                });
                
                // Sort by count and get top 3
                const top3 = typeTotals
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3);
                
                setTopMonthlyTypes(top3);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching case type breakdown:', error);
                setCaseTypes([]);
                setBarangayData([]);
                setTopMonthlyTypes([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const maxTopCount = topMonthlyTypes.length > 0 
        ? Math.max(...topMonthlyTypes.map(item => item.count)) 
        : 100;

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Monthly Case Type Breakdown per Barangay (2025)</p>
                    <select 
                        className='border border-gray-300 rounded-lg p-1 text-xs'
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {MONTHS.map((month, idx) => (
                            <option key={idx} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500'>Loading...</p>
                    </div>
                ) : caseTypes.length > 0 ? (
                    <>
                        <div className='mt-4'>
                            <BarChart
                                height={210}
                                series={caseTypes.map(ct => ({
                                    data: ct.data,
                                    label: ct.label,
                                    stack: 'total',
                                    color: ct.color,
                                }))}
                                xAxis={[{
                                    scaleType: 'band',
                                    data: barangayData,
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
                        <div className='w-4/5 flex flex-wrap gap-3 text-xs justify-center items-center text-center mx-auto'>
                            {caseTypes.map((ct, idx) => (
                                <div key={idx} className='flex items-center gap-1 justify-center -mt-2'>
                                    <div 
                                        className='w-3 h-3 rounded-sm' 
                                        style={{ backgroundColor: ct.color }}
                                    />
                                    <span className='text-gray-700'>{ct.label}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500'>No data available for {selectedMonth}</p>
                    </div>
                )}

                <div className='flex flex-row border rounded-lg mt-4'>
                    <div className='w-full'>
                        <div className='p-4'>
                            <h1 className="text-sm text-gray-500 font-medium">Top 3 Monthly Case Type</h1>
                        </div>

                        <div className='px-4 pb-4'>
                            {topMonthlyTypes.length > 0 ? (
                                topMonthlyTypes.map((item, index) => (
                                    <div key={index} className='flex flex-row mb-3 gap-2'>
                                        <div className='w-1/3 truncate text-sm font-medium text-gray-700 -mb-2'>
                                            {item.case_type}
                                        </div>
                                        <div className='w-2/3 -mb-2'>
                                            <div className='bg-gray-200 rounded-full h-4 overflow-hidden'>
                                                <div 
                                                    className='bg-blue-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold rounded-full transition-all duration-300'
                                                    style={{ width: `${(item.count / maxTopCount) * 100}%` }}
                                                >
                                                    {item.count}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-gray-500'>No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




function UrgentBarangays() {
    const currentDate = new Date();
    const currentMonth = MONTHS[currentDate.getMonth()];
    
    const [urgentBarangays, setUrgentBarangays] = useState([]);
    const [moderateBarangays, setModerateBarangays] = useState([]);
    const [lowBarangays, setLowBarangays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [priorityData, setPriorityData] = useState([]);
    const [barangayNames, setBarangayNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUrgentBarangays = async () => {
            try {
                const data = await reportsAPI.getTopUrgentBarangays();
                setUrgentBarangays(data);
            } catch (error) {
                console.error('Error fetching urgent barangays:', error);
            }
        };
        
        fetchUrgentBarangays();
    }, []);

    useEffect(() => {
        const fetchModerateBarangays = async () => {
            try {
                const data = await reportsAPI.getTopModerateBarangays();
                setModerateBarangays(data);
            } catch (error) {
                console.error('Error fetching moderate barangays:', error);
            }
        };
        
        fetchModerateBarangays();
    }, []);

    useEffect(() => {
        const fetchLowBarangays = async () => {
            try {
                const data = await reportsAPI.getTopLowBarangays();
                setLowBarangays(data);
            } catch (error) {
                console.error('Error fetching low barangays:', error);
            }
        };
        
        fetchLowBarangays();
    }, []);

    useEffect(() => {
        const fetchPriorityData = async () => {
            try {
                setLoading(true);
                const data = await reportsAPI.getPriorityCountsPerBarangay(selectedMonth, '2025');
                
                console.log('Priority data for', selectedMonth, ':', data);
                
                // Check if we have valid data
                if (!data || !data.data || data.data.length === 0) {
                    console.log('No priority data found for', selectedMonth);
                    setPriorityData([]);
                    setBarangayNames([]);
                    setLoading(false);
                    return;
                }
                
                // Transform data for bar chart
                const chartSeries = [
                    {
                        label: 'Urgent',
                        data: data.data.map(b => b.priority_counts[0]),
                        color: '#ef4444',
                        stack: 'total'
                    },
                    {
                        label: 'Moderate',
                        data: data.data.map(b => b.priority_counts[1]),
                        color: '#f59e0b',
                        stack: 'total'
                    },
                    {
                        label: 'Low',
                        data: data.data.map(b => b.priority_counts[2]),
                        color: '#3b82f6',
                        stack: 'total'
                    }
                ];

                setPriorityData(chartSeries);
                setBarangayNames(data.barangays);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching priority counts:', error);
                setPriorityData([]);
                setBarangayNames([]);
                setLoading(false);
            }
        };

        fetchPriorityData();
    }, [selectedMonth]);

    return (
        <div className="w-auto">
            <div className="">
                <div className='flex flex-row gap-3'>
                    <div className='w-2/5'>
                        <div className='flex flex-row items-center items-center justify-between'>
                            <h1 className="text-sm text-gray-500 font-medium">Complaint Priority Count per Barangay (2025)</h1>
                            <select 
                                className='border rounded-lg text-xs h-7 px-1'
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {MONTHS.map((month, idx) => (
                                    <option key={idx} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className='flex justify-center items-center h-64'>
                                <p className='text-gray-500'>Loading...</p>
                            </div>
                        ) : priorityData.length > 0 ? (
                            <>
                                <BarChart
                                    height={150}
                                    series={priorityData}
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: barangayNames,
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            angle: -15,
                                            textAnchor: 'end',
                                        },
                                    }]}
                                    margin={{ bottom: 0 }}
                                    sx={{
                                        '.MuiChartsLegend-root': {
                                            display: 'none',
                                        },
                                    }}
                                />
                                
                                {/* Legend */}
                                <div className='flex flex-wrap gap-3 text-xs justify-center '>
                                    {priorityData.map((priority, idx) => (
                                        <div key={idx} className='flex items-center gap-1'>
                                            <div 
                                                className='w-3 h-3 rounded-sm' 
                                                style={{ backgroundColor: priority.color }}
                                            />
                                            <span className='text-gray-700'>{priority.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className='flex justify-center items-center h-64'>
                                <p className='text-gray-500'>No data available for {selectedMonth}</p>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-row border rounded-xl w-3/5'>
                        <div className='w-1/3 border-r p-4'>
                            <div className='flex flex-row gap-3 mb-6 items-center'>
                                <AlertOctagon className="text-red-600" size={23} strokeWidth={2} />
                                <div className="text-sm text-gray-500 font-medium leading-tight">
                                    Barangays that Needs
                                    <h1 className='text-red-500'>Urgent Attention</h1>
                                </div>
                            </div>
                            {urgentBarangays.length > 0 ? (
                                urgentBarangays.map((brgy, idx) => (
                                    <div key={idx} className='mb-2'>
                                        <div className='text-sm'>
                                            <span className='font-semibold'>{idx + 1}. {brgy.barangay_name}</span>
                                            <h1 className='ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full w-fit inline-block'>
                                                {brgy.urgent_count} urgent
                                            </h1>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-gray-500'>No urgent complaints</p>
                            )}
                        </div>

                        <div className='w-1/3 border-r p-4'>
                            <div className='flex flex-row gap-3 mb-6 items-center '>
                                <AlertTriangle className="text-yellow-600" size={23} strokeWidth={2} />
                                <div className="text-sm text-gray-500 font-medium leading-tight">
                                    Barangays that Needs
                                    <h1 className='text-yellow-500'>Moderate Attention</h1>
                                </div>
                            </div>
                            {moderateBarangays.length > 0 ? (
                                moderateBarangays.map((brgy, idx) => (
                                    <div key={idx} className='mb-2'>
                                        <div className='text-sm'>
                                            <span className='font-semibold'>{idx + 1}. {brgy.barangay_name}</span>
                                            <h1 className='ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full w-fit inline-block'>
                                                {brgy.moderate_count} moderate
                                            </h1>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-gray-500'>No moderate complaints</p>
                            )}
                        </div>
                        <div className='w-1/3 p-4'>
                            <div className='flex flex-row gap-3 mb-6 items-center'>
                                <CircleCheck className="text-green-600" size={23} strokeWidth={2} />
                                <div className="text-sm text-gray-500 font-medium leading-tight">
                                    Barangays that Needs
                                    <h1 className='text-green-500'>Low Attention</h1>
                                </div>
                            </div>
                            {lowBarangays.length > 0 ? (
                                lowBarangays.map((brgy, idx) => (
                                    <div key={idx} className='mb-2'>
                                        <div className='text-sm'>
                                            <span className='font-semibold'>{idx + 1}. {brgy.barangay_name}</span>
                                            <h1 className='ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full w-fit inline-block'>
                                                {brgy.low_count} low
                                            </h1>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-sm text-gray-500'>No low complaints</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




function ResolvedComplaintsperBrgy({ barangays }){
    const currentDate = new Date();
    const currentMonth = MONTHS[currentDate.getMonth()];
    
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [statusTypes, setStatusTypes] = useState([]);
    const [barangayData, setBarangayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [highestResolved, setHighestResolved] = useState({ name: '', count: 0 });
    const [lowestResolved, setLowestResolved] = useState({ name: '', count: 0 });
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [avgResolutionTime, setAvgResolutionTime] = useState(0);
    const [resolutionTimeData, setResolutionTimeData] = useState([]);


    useEffect(() => {
        const fetchResolutionTimes = async () => {
            try {
                const data = await reportsAPI.getAvgResolutionTimePerBarangay(selectedMonth, '2025');
                setResolutionTimeData(data);
                
                if (barangays && barangays.length > 0) {
                    const firstBrgy = barangays[0].name || barangays[0].barangay_name;
                    setSelectedBarangay(firstBrgy);
                    
                    // Find resolution time for this barangay
                    const brgyResTime = data.find(b => b.barangay_name === firstBrgy);
                    setAvgResolutionTime(brgyResTime?.avg_resolution_time_days || null);
                }
            } catch (error) {
                console.error('Error fetching resolution times:', error);
            }
        };

        fetchResolutionTimes();
    }, [barangays, selectedMonth]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await reportsAPI.getMonthlyStatusByBarangay(selectedMonth, '2025');
                
                console.log('Status data for', selectedMonth, ':', data);
                
                // Check if we have valid data
                if (!data || !data.statuses || data.statuses.length === 0 || !data.barangays || data.barangays.length === 0) {
                    console.log('No status data found for', selectedMonth);
                    setStatusTypes([]);
                    setBarangayData([]);
                    setHighestResolved({ name: 'N/A', count: 0 });
                    setLowestResolved({ name: 'N/A', count: 0 });
                    setLoading(false);
                    return;
                }
                
                // Define colors for each status
                const statusColors = {
                    'Pending': '#f59e0b',
                    'In-Progress': '#10b981',
                    'Resolved': '#3b82f6'
                };

                // Transform data for the chart
                const chartSeries = data.statuses.map((status, idx) => ({
                    label: status,
                    data: data.barangays.map(b => b.status_counts[idx] || 0),
                    color: statusColors[status] || '#6b7280'
                }));

                setStatusTypes(chartSeries);
                setBarangayData(data.barangays.map(b => b.barangay_name));

                // Find highest and lowest resolved cases (Resolved is at index 2)
                const resolvedIndex = data.statuses.indexOf('Resolved');
                if (resolvedIndex !== -1) {
                    let maxResolved = { name: '', count: 0 };
                    let minResolved = { name: '', count: Infinity };

                    data.barangays.forEach(b => {
                        const resolvedCount = b.status_counts[resolvedIndex] || 0;
                        if (resolvedCount > maxResolved.count) {
                            maxResolved = { name: b.barangay_name, count: resolvedCount };
                        }
                        if (resolvedCount < minResolved.count && resolvedCount > 0) {
                            minResolved = { name: b.barangay_name, count: resolvedCount };
                        }
                    });

                    setHighestResolved(maxResolved);
                    setLowestResolved(minResolved.count !== Infinity ? minResolved : { name: 'N/A', count: 0 });
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching status breakdown:', error);
                setStatusTypes([]);
                setBarangayData([]);
                setHighestResolved({ name: 'N/A', count: 0 });
                setLowestResolved({ name: 'N/A', count: 0 });
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth]);

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Monthly Pending, In-Progress, and Resolved Cases per Barangay (2025)</p>
                    <select 
                        className='border border-gray-300 rounded-lg p-1 text-xs'
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {MONTHS.map((month, idx) => (
                            <option key={idx} value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500'>Loading...</p>
                    </div>
                ) : statusTypes.length > 0 ? (
                    <>
                        <div className='mt-4'>
                            <BarChart
                                height={210}
                                series={statusTypes.map(ct => ({
                                    data: ct.data,
                                    label: ct.label,
                                    stack: 'total',
                                    color: ct.color,
                                }))}
                                xAxis={[{
                                    scaleType: 'band',
                                    data: barangayData,
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
                            {statusTypes.map((ct, idx) => (
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
                                    Avg. Resolution Time per Barangay
                                </p>

                                <select 
                                    className='w-full border bg-white rounded-t-lg text-xs font-semibold text-blue-500 p-1 px-2 mt-5'
                                    value={selectedBarangay}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        setSelectedBarangay(selected);
                                        const brgyResTime = resolutionTimeData.find(b => b.barangay_name === selected);
                                        setAvgResolutionTime(brgyResTime?.avg_resolution_time_days || null);
                                    }}
                                >
                                    {!Array.isArray(barangays) || barangays.length === 0 ? (
                                        <option value="">Loading barangays...</option>
                                    ) : (
                                        barangays.map((brgy, idx) => (
                                            <option key={idx} value={brgy.name || brgy.barangay_name}>
                                                {brgy.name || brgy.barangay_name}
                                            </option>
                                        ))
                                    )}
                                </select>

                                <h2 className="w-full border rounded-b-xl text-3xl font-bold text-gray-900 text-center p-2 mb-2">
                                    {avgResolutionTime !== null && avgResolutionTime !== undefined ? `${avgResolutionTime} days` : '--'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="bg-white border-l rounded-r-2xl p-4 w-2/3">
                        
                        <p className="text-sm text-gray-500 font-medium mb-4">
                            Performance Highlights
                        </p>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                <TrendingUp size={14} className='inline-block mr-1' color='green'/>
                                Barangay with Highest Resolved Cases
                            </p>
                            <div className='flex flex-row justify-between items-center border rounded-lg mx-4 mt-1'>
                                <h2 className="w-2/3 text-lg px-2 font-semibold text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis">
                                    {highestResolved.name || 'N/A'}
                                </h2>
                                <h2 className='w-1/3 bg-green-500 text-center rounded-lg text-white text-lg font-semibold'>
                                    {highestResolved.count} cases
                                </h2>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">
                                <TrendingDown size={14} className='inline-block mr-1' color='red'/>
                                Barangay with Lowest Resolved Cases
                            </p>
                            <div className='flex flex-row justify-between items-center border rounded-lg mx-4 mt-1'>
                                <h2 className="w-2/3 text-lg px-2 font-semibold text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis">
                                    {lowestResolved.name || 'N/A'}
                                </h2>
                                <h2 className='w-1/3 bg-red-500 text-center rounded-lg text-white text-lg font-semibold'>
                                    {lowestResolved.count} cases
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                    </>
                ) : (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500'>No data available for {selectedMonth}</p>
                    </div>
                )}
            </div>
        </div>
    );
}




function LeadingCaseType() {
    const currentYear = new Date().getFullYear().toString();
    
    const [caseData, setCaseData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [maxCount, setMaxCount] = useState(100);

    useEffect(() => {
        const fetchTopCaseTypes = async () => {
            try {
                const data = await reportsAPI.getTop3CaseTypes(selectedYear);
                setCaseData(data);
                
                // Calculate max count for percentage calculation
                if (data.length > 0) {
                    const max = Math.max(...data.map(item => item.count));
                    setMaxCount(max);
                }
            } catch (error) {
                console.error('Error fetching top case types:', error);
            }
        };

        fetchTopCaseTypes();
    }, [selectedYear]);

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Annual Leading 3 Case Types</p>
                    <select 
                        className='border border-gray-300 rounded-lg p-1 text-xs'
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                </div>

                <div className='mt-2'>
                    {caseData.length > 0 ? (
                        caseData.map((item, index) => (
                            <div key={index} className='flex items-center mb-3 gap-2'>
                                <div className='w-1/3 truncate text-sm font-medium text-gray-700 -mb-2'>
                                    {item.case_type}
                                </div>
                                <div className='w-2/3'>
                                    <div className='bg-gray-200 rounded-full h-5 -mb-2 overflow-hidden '>
                                        <div 
                                            className='bg-blue-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold rounded-full transition-all duration-300'
                                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                                        >
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-sm text-gray-500'>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
} 





// connected to backend
function AnnualComplaintCount() {
    const currentYear = new Date().getFullYear().toString();
    
    const [annualCount, setAnnualCount] = useState('...');
    const [monthlyData, setMonthlyData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const annualData = await reportsAPI.getAnnualComplaintCounts(selectedYear);
                setAnnualCount(annualData[0]?.count || 0);

                const monthly = await reportsAPI.getMonthlyComplaintCounts(selectedYear);
                setMonthlyData(monthly);
            } catch (error) {
                console.error('Failed to fetch complaint data:', error);
            }
        };
        fetchData();
    }, [selectedYear]);

    // Extract counts for each month, defaulting to 0 if no data
    const getMonthlyValues = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months.map(month => {
            const found = monthlyData.find(m => m.month?.trim() === month);
            return found ? found.count : 0;
        });
    };

    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Annual Total Complaints</p>
                    <select 
                        className='border border-gray-300 rounded-lg p-1 text-xs'
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                </div>
                <div className='flex flex-row justify-between'>
                    <h2 className="event-value">{annualCount}</h2>
                    <div className="event-chart">
                        <LineChart
                            height={80}
                            series={[
                                {
                                    data: getMonthlyValues(),
                                    showMark: false,
                                    color: '#2563eb',
                                    area: true,
                                },
                            ]}
                            xAxis={[{ scaleType: 'point', data: MONTHS, hide: true }]}
                            yAxis={[{ hide: true }]}
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

// static only
function SatisfactionLevel() {
    return (
        <div className="event-card">
            <div className="event-content">
                <div className='flex flex-row justify-between items-center mb-2'>
                    <p className="event-title">Complainant Overall Satisfaction Level</p>
                    <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                </div>
                <div className='flex flex-row'>
                    <div className='w-1/3 border-r-2 items-center justify-center text-center'>
                        <h1 className='text-3xl font-semibold leading-none'>4.1</h1>
                        <p className='text-xs text-gray-600'>(125 reviews)</p>
                        <div className='flex flex-row justify-center py-1'><Star size={16} color='orange' /><Star size={16} color='orange' /><Star size={16} color='orange' /><Star size={16} color='orange' /><Star size={16} /> </div>
                    </div>
                    <div className='w-2/3 ml-4'>
                        <div className='flex flex-row items-center gap-2 mt-[1px]'>
                            <p className='w-3 leading-none text-sm text-gray-700'>5</p>
                            <div className='h-3 w-4/5 bg-yellow-500 rounded-full'></div>
                        </div>
                        
                        <div className='flex flex-row items-center gap-2 mt-[1px]'>
                            <p className='w-3 leading-none text-sm text-gray-700'>4</p>
                            <div className='h-3 w-3/6 bg-yellow-500 rounded-full'></div>
                        </div>
                        
                        <div className='flex flex-row items-center gap-2 mt-[1px]'>
                            <p className='w-3 leading-none text-sm text-gray-700'>3</p>
                            <div className='h-3 w-2/5 bg-yellow-500 rounded-full'></div>
                        </div>
                        
                        <div className='flex flex-row items-center gap-2 mt-[1px]'>
                            <p className='w-3 leading-none text-sm text-gray-700'>2</p>
                            <div className='h-3 w-1/5 bg-yellow-500 rounded-full'></div>
                        </div>
                        
                        <div className='flex flex-row items-center gap-2 mt-[1px]'>
                            <p className='w-3 leading-none text-sm text-gray-700'>1</p>
                            <div className='h-3 w-1/6 bg-yellow-500 rounded-full'></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
} 

function BasicDateCalendar() {
    return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='flex flex-row border border-gray-200 shadow-md rounded-2xl mt-2 px-5 py-3 text-sm gap-5 justify-center items-center'>
                    <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
                </div>
            </LocalizationProvider>
    );
}

function AnnouncementCard({logo, category, title, details}) {
    return (
        <div className='border rounded-lg my-3 hover:bg-gray-100 py-4 px-3'>
            <div className='flex flex-row items-center justify-between mb-4'>
                <div>
                    <h1 className='font-semibold text-lg leading-none pr-3'>{title}</h1>
                    <div className='flex flex-row items-center italic text-sm text-gray-600 gap-1'>
                        <div className='inline-block'>{logo}</div><div>{category}</div>
                    </div>
                </div>
                <div className='flex flex-row gap-1 items-center bg-gray-200 rounded-2xl px-2 py-1 pr-3 text-xs'>
                    <Pin size={15} strokeWidth={'2.25px'} className='inline-block mt-1' />
                    <h1>Pinned</h1>
                </div>
            </div>
            <p className='leading-none border-l-[3px] border-blue-300 pl-3 ml-2'>{details}</p>
        </div>
    );
}

