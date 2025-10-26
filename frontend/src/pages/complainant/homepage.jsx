import React, { useState } from 'react';
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import Footer from '../../components/footer.jsx';

const CU_HomePage = () => {
    return (
        <div className='bg-white'>
            <NewsCards />
            <CityPrograms />
            <Feedback />
            <Footer />
        </div>
    );
}


function NewsCards() {
    // Example news data
    const news = [
        { title: "News Title 1", desc: "Brief description of the news article goes here.", img: "/images/news.jpg" },
        { title: "News Title 2", desc: "Brief description of the news article goes here.", img: "/images/news.jpg" },
        { title: "News Title 3", desc: "Brief description of the news article goes here.", img: "/images/news.jpg" },
        { title: "News Title 4", desc: "Brief description of the news article goes here.", img: "/images/news.jpg" },
        { title: "News Title 5", desc: "Brief description of the news article goes here.", img: "/images/news.jpg" },
    ];

    const [index, setIndex] = useState(0); // tracks the starting index

    // show 3 cards at a time
    const visibleCount = 3;

    // handle navigation with looping
    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % news.length);
    };

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    // compute visible items
    const visibleNews = [];
    for (let i = 0; i < visibleCount; i++) {
        visibleNews.push(news[(index + i) % news.length]);
    }

    return (
        <div className="bg-white mb-10 text-black mx-20">
            {/* Header */}
            <div className="flex flex-row justify-between items-center">
                <div>
                    <h1 className="font-bold text-blue-400 text-3xl leading-tight">
                        What's Happening
                    </h1>
                    <p className="text-gray-600 leading-tight text-sm">
                        Read the latest news and events
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={prevSlide}>
                        <CircleArrowLeft size={40} color="#60A5FA" />
                    </button>
                    <button onClick={nextSlide}>
                        <CircleArrowRight size={40} color="#60A5FA" />
                    </button>
                </div>
            </div>

            {/* News Cards */}
            <div className="flex flex-row gap-20 items-center justify-center mt-8 transition-transform duration-500 ease-in-out">
                {visibleNews.map((item, i) => (
                  <div key={i} className="hover:bg-white transform transition duration-300 hover:scale-105" >
                        <div
                            className={`bg-[url('${item.img}')] bg-cover bg-center h-80 w-80 rounded-2xl shadow-lg`}
                        ></div>
                        <div className="border-l-4 border-yellow-400 pl-2 mt-3">
                            <h1 className="font-bold text-black text-lg">{item.title}</h1>
                            <p className="text-black text-sm w-70 leading-tight">{item.desc}</p>
                        </div>
                  </div>
                ))}
            </div>
        </div>
    );
}


function CityPrograms(){
    return (
        <div className='bg-gray-100 h-80 px-20'>
            <h1 className='font-bold text-black text-3xl leading-tight pt-10'>City Programs</h1>
            <p className='text-gray-600 leading-tight text-sm'>Learn more about the city's major plans and programs</p>

            {/* City programs cards */}
            <div className='flex flex-row items-center mt-8 mb-5 gap-10 justify-center'>

                <div className="relative bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.1)),url('/images/people.jpeg')] bg-cover bg-center bg-blend-overlay bg-red-300/90 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white w-60 h-32">
                    <h1 className="text-2xl text-white font-extrabold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)] leading-none  mb-3">Free Wifi for All</h1>
                    <button className="bg-white border border-white rounded-md px-4 py-1 text-sm text-red-400 font-medium hover:bg-white transform transition duration-300 hover:scale-105">
                        Learn More
                    </button>
                </div>

                <div className="relative bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.1)),url('/images/iligan-port.jpg')] bg-cover bg-center bg-blend-overlay bg-green-300/90 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white w-60 h-32">
                    <h1 className="text-2xl text-white font-extrabold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)] leading-none  mb-3">Investments and Promotions</h1>
                    <button className="bg-white border border-white rounded-md px-4 py-1 text-sm text-green-400 font-medium hover:bg-white transform transition duration-300 hover:scale-105">
                        Learn More
                    </button>
                </div>

                <div className="relative bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.1)),url('/images/vaccine.jpg')] bg-cover bg-center bg-blend-overlay bg-blue-300/90 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white w-60 h-32">
                    <h1 className="text-2xl text-white font-extrabold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)] leading-none  mb-3">Covid-19 Vaccination</h1>
                    <button className="bg-white border border-white rounded-md px-4 py-1 text-sm text-blue-400 font-medium hover:bg-white transform transition duration-300 hover:scale-105">
                        Learn More
                    </button>
                </div>

                <div className="relative bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.1)),url('/images/iligan-port.jpg')] bg-cover bg-center bg-blend-overlay bg-purple-300/90 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white w-60 h-32">
                    <h1 className="text-2xl text-white font-extrabold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)] leading-none  mb-3">City Wide Transformation</h1>
                    <button className="bg-white border border-white rounded-md px-4 py-1 text-sm text-blue-400 font-medium hover:bg-white transform transition duration-300 hover:scale-105">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    )
}


function Feedback() {
    return(
        <div className='bg-gradient-to-r from-[#378591] to-[#1b4f57] text-white mx-20 my-10 p-10 flex justify-between items-center rounded-2xl'>
            <div>
                <h1 className='text-2xl font-extrabold'>We would like to hear from you</h1>
                <p>Send us your feedback, comments and suggestions to help improve our services</p>
            </div>
            <button><CircleArrowRight size={40} color="white" /></button>
        </div>
    )
}



export default CU_HomePage;