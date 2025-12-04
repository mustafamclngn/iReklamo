import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartNoAxesColumn, Ellipsis, HandHelping, Megaphone, MessageCircleMore, Pin, SquareStack, SquareStar } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className='flex flex-row w-full h-full p-4 gap-4'> 

            {/* Left area */}
            <div className=' w-3/4'>
                <div className='flex flex-row gap-3'>
                    {/* COMPLAINT COUNT */}
                    <div className='border-[1px] border-gray-200 bg-gray-100 p-4 rounded-lg w-1/3'>
                        <div className='flex flex-row justify-between items-start'>
                            <div>
                                <h1 className='text-base font-semibold leading-none'>Annual Total Complaints</h1>
                                <p className='text-gray-600 text-base'>Top 3 case type for each month</p>
                            </div>
                            <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                              <option>2024</option>
                              <option>2023</option>
                              <option>2022</option>
                              <option>2021</option>
                              <option>All time</option>
                            </select>
                        </div>

                        <div className='flex flex-row items-center bg-white rounded-lg mt-4 border-[1px] border-gray-200 pt-2'>
                            <h1 className='text-5xl font-bold -mr-12 ml-3 text-gray-700'>1.2k</h1>
                            <MiniTrendChart />
                        </div>
                    </div>

                    <div className='border-[1px] border-gray-200 bg-gray-100 p-4 rounded-lg w-1/3'>
                        <div className='flex flex-row justify-between items-start'>
                            <div>
                                <h1 className='text-base font-semibold leading-none'>Leading Case Types</h1>
                                <p className='text-gray-600 text-base'>Top 3 case type for each month</p>
                            </div>
                            <select className='border border-gray-300 rounded-lg p-1 text-xs'>
                              <option>Jan</option>
                              <option>Feb</option>
                              <option>Mar</option>
                              <option>Apr</option>
                              <option>May</option>
                              <option>Jun</option>
                              <option>Jul</option>
                              <option>Aug</option>
                              <option>Sep</option>
                              <option>Oct</option>
                              <option>Nov</option>
                              <option>Dec</option>
                            </select>
                        </div>

                        <div className='flex flex-row items-center bg-white rounded-lg mt-4 border-[1px] border-gray-200 pt-2'>
                            
                        </div>
                    </div>

                    {/* AVERAGE RESOLUTION TIME */}
                    <div className='border-[1px] border-gray-200 p-4 rounded-lg w-1/3'>
                        <h1 className='text-base font-semibold leading-none'>Highest Case Type per Month</h1>
                        <p className='text-gray-600 text-base'>Top 3 case type for each month</p>

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


function MiniTrendChart() {
    return (
        <Box> 
            <LineChart
                xAxis={[
                    { 
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        label: '',
                        tickLabelStyle : { display: 'none' }, 
                        disableLine: true,
                        disableTicks: true,
                    }
                ]}
                
                yAxis={[
                    { 
                        label: '',
                        tickLabelStyle : { display: 'none' }, 
                        disableLine: true,
                        disableTicks: true,
                    }
                ]}
                
                series={[
                    {
                        data: [10, 5, 12, 11, 15, 13, 16, 7, 14, 15, 13, 14], 
                        area: true,
                        color: '#90D5FF', 
                        showMark: false,
                    },
                ]}
                width={250}
                height={100}
                margin={0}
            />
        </Box>
    );
}



