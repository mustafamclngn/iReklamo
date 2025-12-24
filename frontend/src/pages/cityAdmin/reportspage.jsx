// @ts-nocheck
import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ChevronsUpDown, ChevronDown, Download } from 'lucide-react';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import useUserInfoApi from '../../api/userInfo';
import useComplaintsApi from '../../api/complaintsAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const CASE_TYPES = [
    'Infrastructure & Utilities',
    'Environment & Sanitation',
    'Peace & Order',
    'Government Service & Conduct',
    'Consumer & Business Complaints',
    'Public Safety & Welfare',
    'Other',
];

export default function Reports() {
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [showDownloadReport, setShowDownloadReport] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('all');
    const tableRef = useRef(null);

    const { getBarangays } = useUserInfoApi();
    const { getAllComplaints } = useComplaintsApi();

    useEffect(() => {
        const fetchBarangays = async () => {
            try {
                const response = await getBarangays();
                const list = response?.data || response || [];
                setBarangays(list);
            } catch (error) {
                console.error('Failed to fetch barangays for reports page:', error);
            }
        };

        fetchBarangays();
    }, []);

    // Fetch all complaints for table
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllComplaints();

                if (response?.success && Array.isArray(response.data)) {
                    setReports(response.data);
                } else if (Array.isArray(response)) {
                    setReports(response);
                } else {
                    setReports([]);
                }
            } catch (err) {
                console.error('Failed to fetch complaints for reports table:', err);
                setError('Failed to load complaints');
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);
    const [activeFilters, setActiveFilters] = useState({
        barangay: '',
        caseType: '',
        priority: '',
        status: '',
        year: '',
        month: '',
        startDate: '',
        endDate: '',
    });

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
    };

    const handleCloseAdvancedSearch = () => {
        setShowAdvancedSearch(false);
    };

    return (
        <div className='flex w-full justify-center'>
            <div className='flex flex-col w-[1591px] h-full p-4 gap-4'>
                <div className='flex flex-row justify-between'>
                    <div className='flex gap-2'>
                        <div className="flex flex-row items-center border-[1px] border-gray-400 py-1 px-3 rounded-lg">
                            <Search className="inline-block mr-2 text-gray-500 scale-90" size={"20px"} />
                            <input
                                type="text"
                                className='border-none outline-none text-[15px] mt-[1px] focus:outline-none focus:ring-0'
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className='bg-gray-100 py-1 px-2 rounded-lg text-[13px] '
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                        >
                            <option value="all">All Fields</option>
                            <option value="tracking">Tracking ID</option>
                            <option value="barangay">Barangay</option>
                            <option value="case_type">Case Type</option>
                            <option value="priority">Priority</option>
                            <option value="status">Status</option>
                            <option value="assigned">Assigned Official</option>
                        </select>
                        <button
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            className='flex bg-[#fca31c] rounded-lg h-8 text-[13px] items-center text-white px-3 hover:bg-[#e89419] transition-colors'
                        >
                            <FontAwesomeIcon icon={faSliders} size='lg' color='white' className='mr-2 scale-80'/>
                            Advanced Search
                        </button>
                    </div>
                    
                    <div className='flex border-[1px] text-[13px] border-gray-400 rounded-lg items-center hover:bg-gray-100 cursor-pointer relative transition duration-200 ease-in-out'>
                        <button 
                            className='font-semibold px-2 '
                            onClick={() => setShowDownloadReport(!showDownloadReport)}
                        >
                            Download Report
                            <ChevronDown className='inline-block ml-1 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"2px"} />
                        </button>

                        <div
                            className={`absolute right-0 top-full mt-2 z-50 transform origin-top transition-all duration-200 ease-out
                                ${showDownloadReport ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
                        >
                            <DownloadReport
                                onDownload={(format) => {
                                    if (!tableRef.current) return;

                                    if (format === 'pdf' && tableRef.current.exportCurrentPageToPdf) {
                                        tableRef.current.exportCurrentPageToPdf();
                                    } else if (format === 'csv' && tableRef.current.exportCurrentPageToCsv) {
                                        tableRef.current.exportCurrentPageToCsv();
                                    }

                                    setShowDownloadReport(false);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out 
                    ${showAdvancedSearch ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}
                `}>
                    <AdvancedSearch 
                        barangays={barangays}
                        initialFilters={activeFilters}
                        onApply={handleApplyFilters}
                    />
                </div>

                <div>
                    <DataTable
                        ref={tableRef}
                        rows={reports}
                        loading={loading}
                        error={error}
                        searchQuery={searchQuery}
                        searchField={searchField}
                        activeFilters={activeFilters}
                    />
                </div>
            </div>
        </div>
    )
}

function AdvancedSearch({ barangays = [], initialFilters, onApply }) {
    const [selectedBarangay, setSelectedBarangay] = useState(initialFilters?.barangay || '');
    const [caseType, setCaseType] = useState(initialFilters?.caseType || '');
    const [priority, setPriority] = useState(initialFilters?.priority || '');
    const [status, setStatus] = useState(initialFilters?.status || '');
    const [startDate, setStartDate] = useState(initialFilters?.startDate || '');
    const [endDate, setEndDate] = useState(initialFilters?.endDate || '');
    const [year, setYear] = useState(initialFilters?.year || '');
    const [month, setMonth] = useState(initialFilters?.month || '');

    useEffect(() => {
        setSelectedBarangay(initialFilters?.barangay || '');
        setCaseType(initialFilters?.caseType || '');
        setPriority(initialFilters?.priority || '');
        setStatus(initialFilters?.status || '');
        setStartDate(initialFilters?.startDate || '');
        setEndDate(initialFilters?.endDate || '');
        setYear(initialFilters?.year || '');
        setMonth(initialFilters?.month || '');
    }, [initialFilters]);

    const isTimeframeActive = !!(startDate || endDate);
    const isYearMonthActive = !!(year || month);
    
    return (
        <div>
            <div className='flex flex-row gap-2'>
                <div className='border border-gray-300 w-1/2 p-3 rounded-lg'>
                    <p className='text-xs font-semibold mb-2'>Select Fields</p>
                    <div className='flex gap-2 h-6 text-xs'>
                        <select 
                            className='w-1/3 bg-gray-100 px-1 rounded'
                            value={selectedBarangay}
                            onChange={(e) => setSelectedBarangay(e.target.value)}
                        >
                            <option value="">All Barangays</option>
                            {Array.isArray(barangays) && barangays.map((brgy) => (
                                <option
                                    key={brgy.id || brgy.barangay_id || brgy.name || brgy.barangay_name}
                                    value={brgy.name || brgy.barangay_name}
                                >
                                    {brgy.name || brgy.barangay_name}
                                </option>
                            ))}
                        </select>
                        
                        <select 
                            className='w-1/3 bg-gray-100 px-1 rounded'
                            value={caseType}
                            onChange={(e) => setCaseType(e.target.value)}
                        >
                            <option value="">All Case Types</option>
                            {CASE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <select 
                            className='w-1/3 bg-gray-100 px-1 rounded'
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="">All Priority Types</option>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Urgent">Urgent</option>
                        </select>

                        <select 
                            className='w-1/3 bg-gray-100 px-1 rounded'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In-Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-row b w-1/2 rounded-lg'>
                    <div className={`relative border-[1px] w-1/2 border-gray-300 rounded-l-lg p-3 ${isYearMonthActive ? 'bg-gray-100' : 'bg-white'}`}>
                        <p className='text-xs font-semibold mb-2'>Select Timeframe</p>
                        <div className='flex gap-2 h-6 text-xs items-center h-6'>
                            <input
                                type='date'
                                className='bg-gray-100 h-6 px-2 rounded w-1/2'
                                value={startDate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setStartDate(value);
                                    if (value) {
                                        setYear('');
                                        setMonth('');
                                    }
                                }}
                                disabled={isYearMonthActive}
                            />
                            -
                            <input
                                type='date'
                                className='bg-gray-100 h-6 px-2 rounded w-1/2'
                                value={endDate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEndDate(value);
                                    if (value) {
                                        setYear('');
                                        setMonth('');
                                    }
                                }}
                                disabled={isYearMonthActive}
                            />
                        </div>
                        {isYearMonthActive && (
                            <div className='absolute inset-0 bg-black/10 rounded-l-lg pointer-events-none' />
                        )}
                    </div>
                    <div className={`relative border-[1px] w-1/2 border-gray-300 rounded-r-lg p-3 ${isTimeframeActive ? 'bg-gray-100' : 'bg-white'}`}>
                        <p className='text-xs font-semibold mb-2'>Select Year/Month</p>
                        <div className='flex gap-2'>
                            <select
                                className='bg-gray-100 h-6 px-2 rounded text-[13px] w-1/2'
                                value={year}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setYear(value);
                                    if (value) {
                                        setStartDate('');
                                        setEndDate('');
                                    }
                                }}
                                disabled={isTimeframeActive}
                            >
                                <option value=''>All Years</option>
                                <option value='2021'>2021</option>
                                <option value='2022'>2022</option>
                                <option value='2023'>2023</option>
                                <option value='2024'>2024</option>
                                <option value='2025'>2025</option>
                            </select>
                            <select
                                className='bg-gray-100 h-6 px-2 rounded text-[13px] w-1/2'
                                value={month}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMonth(value);
                                    if (value) {
                                        setStartDate('');
                                        setEndDate('');
                                    }
                                }}
                                disabled={isTimeframeActive}
                            >
                                <option value=''>All Months</option>
                                <option value='1'>January</option>
                                <option value='2'>February</option>
                                <option value='3'>March</option>
                                <option value='4'>April</option>
                                <option value='5'>May</option>
                                <option value='6'>June</option>
                                <option value='7'>July</option>
                                <option value='8'>August</option>
                                <option value='9'>September</option>
                                <option value='10'>October</option>
                                <option value='11'>November</option>
                                <option value='12'>December</option>
                            </select>
                        </div>
                        {isTimeframeActive && (
                            <div className='absolute inset-0 bg-black/10 rounded-r-lg pointer-events-none' />
                        )}
                    </div>
                </div>
            </div>
            
            <div className='flex justify-end mt-2 gap-2'>
                <button 
                    className='flex flex-row rounded-lg items-center gap-1 bg-gray-100 p-1 px-3 text-sm hover:bg-gray-200 transition-colors'
                    type='button'
                    onClick={() => {
                        setSelectedBarangay('');
                        setCaseType('');
                        setPriority('');
                        setStatus('');
                        setStartDate('');
                        setEndDate('');
                        setYear('');
                        setMonth('');
                        onApply?.({
                            barangay: '',
                            caseType: '',
                            priority: '',
                            status: '',
                            year: '',
                            month: '',
                            startDate: '',
                            endDate: '',
                        });
                    }}
                >
                    <X size={'15'} className='-mt-[1px]'/>
                    Clear
                </button>
                <button 
                    className='bg-[#fca31a] rounded-lg text-white p-1 text-sm px-3 hover:bg-[#e89419] transition-colors'
                    type='button'
                    onClick={() => {
                        onApply?.({
                            barangay: selectedBarangay,
                            caseType,
                            priority,
                            status,
                            year,
                            month,
                            startDate,
                            endDate,
                        });
                    }}
                >
                    Apply Filter
                </button>
            </div>
        </div>
    )
}

const DataTable = forwardRef(function DataTable({ rows = [], loading = false, error = null, searchQuery = '', searchField = 'all', activeFilters = {} }, ref){
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const rowsPerPage = 20;

    const getDurationDays = (row) => {
        if (!row.created_at) return null;

        const start = new Date(row.created_at);
        if (Number.isNaN(start.getTime())) return null;

        let end;
        if (row.status === 'Resolved') {
            const resolvedAt = row.resolved_at || row.updated_at;
            end = resolvedAt ? new Date(resolvedAt) : new Date();
        } else {
            end = new Date();
        }

        if (Number.isNaN(end.getTime())) return null;

        const diffMs = end.getTime() - start.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return days < 0 ? 0 : days;
    };

    const getSortValue = (row, key) => {
        switch (key) {
            case 'tracking':
                return row.complaint_code || row.tracking_id || row.complaint_id || '';
            case 'dateFiled':
                return row.created_at || '';
            case 'barangay':
                return row.barangay || '';
            case 'case_type':
                return row.case_type || '';
            case 'priority':
                return row.priority || '';
            case 'status':
                return row.status || '';
            case 'assigned':
                return row.assigned_office || row.assignedOfficial || '';
            case 'resolutionDate':
                // Only use a resolution date for resolved complaints
                if (row.status === 'Resolved') {
                    return row.resolved_at || row.updated_at || '';
                }
                return '';
            case 'duration':
                return getDurationDays(row) ?? 0;
            default:
                return '';
        }
    };

    const normalizedIncludes = (value, query) => {
        if (!query) return true;
        return String(value || '')
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase());
    };

    const normalizeExact = (value) =>
        String(value || '')
            .toLocaleLowerCase()
            .replace(/[\s_-]+/g, '');

    const filteredRows = rows.filter((row) => {
        // Advanced filters
        if (activeFilters.barangay) {
            const barangayVal = getSortValue(row, 'barangay');
            if (normalizeExact(barangayVal) !== normalizeExact(activeFilters.barangay)) {
                return false;
            }
        }

        if (activeFilters.caseType) {
            const caseTypeVal = getSortValue(row, 'case_type');
            if (normalizeExact(caseTypeVal) !== normalizeExact(activeFilters.caseType)) {
                return false;
            }
        }

        if (activeFilters.priority) {
            const priorityVal = getSortValue(row, 'priority');
            if (normalizeExact(priorityVal) !== normalizeExact(activeFilters.priority)) {
                return false;
            }
        }

        if (activeFilters.status) {
            const statusVal = getSortValue(row, 'status');
            if (normalizeExact(statusVal) !== normalizeExact(activeFilters.status)) {
                return false;
            }
        }

        if (activeFilters.startDate || activeFilters.endDate) {
            const filedVal = getSortValue(row, 'dateFiled');
            if (!filedVal) return false;

            const filedTime = new Date(filedVal).getTime();
            if (activeFilters.startDate) {
                const startTime = new Date(activeFilters.startDate).getTime();
                if (filedTime < startTime) return false;
            }
            if (activeFilters.endDate) {
                const endTime = new Date(activeFilters.endDate).getTime();
                if (filedTime > endTime) return false;
            }
        }

        if (activeFilters.year || activeFilters.month) {
            const filedVal = getSortValue(row, 'dateFiled');
            if (!filedVal) return false;

            const dateObj = new Date(filedVal);
            if (Number.isNaN(dateObj.getTime())) return false;

            if (activeFilters.year && String(dateObj.getFullYear()) !== String(activeFilters.year)) {
                return false;
            }

            if (activeFilters.month) {
                const monthIndex = dateObj.getMonth() + 1; // 1-12
                if (String(monthIndex) !== String(activeFilters.month)) {
                    return false;
                }
            }
        }

        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return true;

        if (searchField === 'all') {
            return (
                normalizedIncludes(getSortValue(row, 'tracking'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'barangay'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'case_type'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'priority'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'status'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'assigned'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'dateFiled'), trimmedQuery) ||
                normalizedIncludes(getSortValue(row, 'resolutionDate'), trimmedQuery)
            );
        }

        return normalizedIncludes(getSortValue(row, searchField), trimmedQuery);
    });

    const sortedRows = sortConfig.key
        ? [...filteredRows].sort((a, b) => {
              const aVal = getSortValue(a, sortConfig.key);
              const bVal = getSortValue(b, sortConfig.key);

              // Handle date fields as dates
              if (sortConfig.key === 'dateFiled' || sortConfig.key === 'resolutionDate') {
                  const aTime = aVal ? new Date(aVal).getTime() : 0;
                  const bTime = bVal ? new Date(bVal).getTime() : 0;
                  return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
              }

              if (sortConfig.key === 'duration') {
                  const aNum = typeof aVal === 'number' ? aVal : Number(aVal) || 0;
                  const bNum = typeof bVal === 'number' ? bVal : Number(bVal) || 0;
                  return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
              }

              const aStr = String(aVal).toLocaleLowerCase();
              const bStr = String(bVal).toLocaleLowerCase();
              if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          })
                : filteredRows;

    const totalRows = sortedRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageRows = sortedRows.slice(startIndex, endIndex);

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
        setCurrentPage(1);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const escapeCsvValue = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (/[",\r\n]/.test(str)) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };

    useImperativeHandle(ref, () => ({
        exportCurrentPageToPdf() {
            try {
                const doc = new jsPDF({ orientation: 'landscape' });
                doc.setFontSize(12);
                doc.text('Complaints Report', 14, 10);

                const head = [[
                    '#',
                    'Tracking ID',
                    'Date Filed',
                    'Barangay',
                    'Case Type',
                    'Priority',
                    'Status',
                    'Assigned Official',
                    'Date Resolved',
                    'Days'
                ]];

                const body = pageRows.map((row, idx) => {
                    const index = startIndex + idx + 1;
                    const tracking = row.complaint_code || row.tracking_id || row.complaint_id || '-';
                    const dateFiled = row.created_at ? new Date(row.created_at).toLocaleDateString() : '-';
                    const barangay = row.barangay || '-';
                    const caseType = row.case_type || '-';
                    const priority = row.priority || '-';
                    const status = row.status || '-';
                    const assigned = row.assigned_office || row.assignedOfficial || '-';

                    let resolvedDate = '-';
                    if (row.status === 'Resolved') {
                        const resolutionDate = row.resolved_at || row.updated_at;
                        resolvedDate = resolutionDate ? new Date(resolutionDate).toLocaleDateString() : '-';
                    }

                    const days = getDurationDays(row);
                    const daysStr = days != null ? String(days) : '-';

                    return [
                        index,
                        tracking,
                        dateFiled,
                        barangay,
                        caseType,
                        priority,
                        status,
                        assigned,
                        resolvedDate,
                        daysStr
                    ];
                });

                autoTable(doc, {
                    head,
                    body,
                    startY: 16,
                    styles: { fontSize: 8 }
                });

                doc.save('complaints_report.pdf');
            } catch (e) {
                console.error('Failed to export complaints report PDF', e);
            }
        },
        exportCurrentPageToCsv() {
            try {
                const headers = [
                    '#',
                    'Tracking ID',
                    'Date Filed',
                    'Barangay',
                    'Case Type',
                    'Priority',
                    'Status',
                    'Assigned Official',
                    'Date Resolved',
                    'Days'
                ];

                const rows = pageRows.map((row, idx) => {
                    const index = startIndex + idx + 1;
                    const tracking = row.complaint_code || row.tracking_id || row.complaint_id || '-';
                    const dateFiled = row.created_at ? new Date(row.created_at).toLocaleDateString() : '-';
                    const barangay = row.barangay || '-';
                    const caseType = row.case_type || '-';
                    const priority = row.priority || '-';
                    const status = row.status || '-';
                    const assigned = row.assigned_office || row.assignedOfficial || '-';

                    let resolvedDate = '-';
                    if (row.status === 'Resolved') {
                        const resolutionDate = row.resolved_at || row.updated_at;
                        resolvedDate = resolutionDate ? new Date(resolutionDate).toLocaleDateString() : '-';
                    }

                    const days = getDurationDays(row);
                    const daysStr = days != null ? String(days) : '-';

                    return [
                        index,
                        tracking,
                        dateFiled,
                        barangay,
                        caseType,
                        priority,
                        status,
                        assigned,
                        resolvedDate,
                        daysStr
                    ];
                });

                const csvLines = [
                    headers.map(escapeCsvValue).join(','),
                    ...rows.map((r) => r.map(escapeCsvValue).join(','))
                ];

                const csvContent = csvLines.join('\r\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'complaints_report.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error('Failed to export complaints report CSV', e);
            }
        }
    }));

    return (
        <div className='border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white'>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-sm table-fixed'>
                    <thead>
                        <tr className='bg-gray-100 text-xs tracking-wide text-gray-600'>
                            <th className='px-2 py-2 text-left w-6'>#</th>
                            <th className='px-4 py-2 text-left w-48'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('tracking')}
                                >
                                    Tracking ID
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-[130px]'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('dateFiled')}
                                >
                                    Date Filed
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-40'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('barangay')}
                                >
                                    Barangay
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-72'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('case_type')}
                                >
                                    Case Type
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>                            
                            <th className='px-4 py-2 text-left w-28'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('priority')}
                                >
                                    Priority
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-32'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('status')}
                                >
                                    Status
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-48'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('assigned')}
                                >
                                    Assigned Official
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-44'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('resolutionDate')}
                                >
                                    Date Resolved
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                            <th className='px-4 py-2 text-left w-32'>
                                <button
                                    className='flex items-center uppercase'
                                    type='button'
                                    onClick={() => handleSort('duration')}
                                >
                                    Days
                                    <ChevronsUpDown className='inline-block ml-1 text-gray-600 cursor-pointer -mt-[1px]' size={"15px"} strokeWidth={"1.5px"} />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={11} className='px-4 py-4 text-center text-gray-500 text-sm'>
                                    Loading complaints...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={11} className='px-4 py-4 text-center text-red-500 text-sm'>
                                    {error}
                                </td>
                            </tr>
                        ) : pageRows.length > 0 ? (
                            pageRows.map((row, idx) => (
                                <tr key={row.id || row.tracking_id || idx} className='border-t hover:bg-gray-50'>
                                    <td className='px-2 py-1 text-xs text-gray-500'>{startIndex + idx + 1}</td>
                                    <td className='px-4 py-1'>{row.complaint_code || row.tracking_id || row.complaint_id || '-'}</td>
                                    <td className='px-4 py-1'>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td>
                                    <td className='px-4 py-1'>{row.barangay || '-'}</td>
                                    <td className='px-4 py-1'>{row.case_type || '-'}</td>
                                    <td className='px-4 py-1'>{row.priority || '-'}</td>
                                    <td className='px-4 py-1'>{row.status || '-'}</td>
                                    <td className='px-4 py-1'>{row.assigned_office || row.assignedOfficial || '-'}</td>
                                    <td className='px-4 py-1'>
                                        {row.status === 'Resolved'
                                            ? (() => {
                                                const resolutionDate = row.resolved_at || row.updated_at;
                                                return resolutionDate
                                                    ? new Date(resolutionDate).toLocaleDateString()
                                                    : '-';
                                            })()
                                            : '-'}
                                    </td>
                                    <td className='px-4 py-1'>
                                        {(() => {
                                            const days = getDurationDays(row);
                                            return days != null ? days : '-';
                                        })()}
                                    </td>
                                    {/* <td className='px-4 py-1'>
                                        <button
                                            className='text-blue-600 hover:underline text-xs'
                                            onClick={() => {
                                                if (row.id) {
                                                    navigate(`/superadmin/complaints/${row.id}`);
                                                }
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className='px-4 py-4 text-center text-gray-500 text-sm'>
                                    No reports found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-xs text-gray-600'>
                <span>
                    Showing {totalRows === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, totalRows)} of {totalRows}
                </span>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={handlePrev}
                        disabled={safePage === 1}
                        className={`px-2 py-1 rounded border text-xs ${safePage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-white'}`}
                    >
                        Previous
                    </button>
                    <span>
                        Page {safePage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={safePage === totalPages || totalRows === 0}
                        className={`px-2 py-1 rounded border text-xs ${safePage === totalPages || totalRows === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-white'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
});

function DownloadReport({ onDownload }) {
    const [format, setFormat] = useState('pdf');
    return (
        <div className='bg-white border-[1px] border-gray-200 w-[200px] text-[13px] p-4 rounded-lg shadow-md flex flex-col gap-2'>
            <div>
                <p className='font-semibold'>Choose file format: </p>
                <p className='italic text-xs leading-none text-gray-500'>The current displayed table will be downloaded.</p>
            </div> 
            <label className='flex items-center px-2 hover:bg-gray-200 rounded-lg p-1 cursor-pointer mt-1'>
                <input
                    type='radio'
                    name='fileFormat'
                    value='pdf'
                    className='mr-2'
                    checked={format === 'pdf'}
                    onChange={(e) => setFormat(e.target.value)}
                />
                <span>as PDF</span>
            </label>
            <label className='flex items-center px-2 hover:bg-gray-200 rounded-lg p-1 cursor-pointer'>
                <input
                    type='radio'
                    name='fileFormat'
                    value='csv'
                    className='mr-2'
                    checked={format === 'csv'}
                    onChange={(e) => setFormat(e.target.value)}
                />
                <span>as CSV</span>
            </label>
            <button
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out'
                onClick={() => onDownload?.(format)}
            >
                Download Report
            </button>
        </div>
    )
}

