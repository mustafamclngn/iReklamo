import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ChartNoAxesColumn, Ellipsis, HandHelping, Megaphone, MessageCircleMore, Pin, SquareStack, SquareStar } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className='flex flex-row w-full h-full p-4 gap-4'> 

            {/* Left area */}
            <div className=' w-3/4'>
                <div className='flex flex-row gap-3'>
                    {/* COMPLAINT COUNT */}
                    <div className='border-[1px] border-gray-200 p-4 rounded-lg w-fit'>
                        <h1 className='text-xl font-semibold mb-2 text-center'>
                            <ChartNoAxesColumn size={20} strokeWidth={'2.25px'} className='inline-block mr-2 -mt-2'/>
                            Summary Statistics
                        </h1>
                        <div className='flex flex-row gap-1'>
                            <div className='flex flex-col gap-1'>
                                <SummaryStatCard count={'1,420'} label="Total" />
                                <SummaryStatCard count={'712'} label="Pending" />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <SummaryStatCard count={'220'} label="In-Progress" />
                                <SummaryStatCard count={'935'} label="Resolved" />
                            </div>
                        </div>
                        <h1 className='mt-3 font-semibold'>Average Resolution Time</h1>
                        <h1 className='bg-gray-200 h-10'>4.3 days</h1>
                    </div>
                    {/* AVERAGE RESOLUTION TIME */}
                    <div>
                        <div className='border-[1px] border-gray-200 p-4 rounded-lg w-fit'>
                            <h1 className='text-xl font-semibold mb-2'>⏱️ Average Resolution Time</h1>

                        </div>
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


function SummaryStatCard({count, label}) {
    return (
        <div>
            <div className='bg-gray-100 w-24 rounded-md p-1'>
                <div>
                    <h1 className='font-bold text-3xl'>{count}</h1>
                    <p className='text-sm'>{label}</p>
                </div>
            </div>
        </div>
    )
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