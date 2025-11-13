import React, { useState } from 'react';
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";

const CU_HomePage = () => {
    return (
        <div className="flex flex-col bg-white items-center">
            <NewsCards />
            <CityPrograms />
            <Feedback />
        </div>
    );
};


// ======================== NEWS CARDS ========================
function NewsCards() {
    const news = [
        {
            title: "Desinyo sa mga Local Artists nga Inspired sa 20th Century Filipino Artists, Gi-showcase sa Ternocon 2025 Exhibit",
            desc: "10-28-2025",
            img: "/images/news/news.jpg",
        },
        {
            title: "Get ready for the Iligan Paskohan Songwriting Competition 2025!",
            desc: "10-28-2025",
            img: "/images/news/news5.jpg",
        },
        {
            title: "LOOK: LGU Iligan City Named Regional Winner in TESDA Kabalikat Awards 2025",
            desc: "10-28-2025",
            img: "/images/news/news3.jpg",
        },
        {
            title: "LIGTAS UNDAS 2025!",
            desc: "10-28-2025",
            img: "/images/news/news4.jpg",
        },
        {
            title: "Libuan ka mga Senior Citizens sa Iligan, Gi-selebrar sa Elderly Filipino Week",
            desc: "10-28-2025",
            img: "/images/news/news1.jpg",
        },
    ];

    const [index, setIndex] = useState(0);
    const visibleCount = 3;

    const nextSlide = () => setIndex((prev) => (prev + 1) % news.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + news.length) % news.length);

    const visibleNews = [];
    for (let i = 0; i < visibleCount; i++) {
        visibleNews.push(news[(index + i) % news.length]);
    }

    return (
        <section className="w-full bg-white py-10">
            <div className="max-w-[1591px] mx-auto px-10 text-black">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-blue-400 text-3xl leading-tight">
                            What's Happening
                        </h1>
                        <p className="text-gray-600 text-sm">
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
                <div className="flex justify-between flex-wrap mt-8 gap-8 transition-transform duration-500 ease-in-out">
                    {visibleNews.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col w-[30%] min-w-[280px] hover:scale-105 transform transition duration-300"
                        >
                            <div
                                className="rounded-2xl shadow-lg h-96 bg-cover bg-center"
                                style={{ backgroundImage: `url(${item.img})` }}
                            ></div>

                            <div className="border-l-4 border-yellow-400 pl-3 mt-3">
                                <h1 className="font-bold text-black text-lg leading-snug">
                                    {item.title}
                                </h1>
                                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// ======================== CITY PROGRAMS ========================
function CityPrograms() {
    return (
        <section className="w-full bg-gray-100 py-10">
            <div className="max-w-[1591px] mx-auto px-10 flex flex-col justify-center">
                <h1 className="font-bold text-black text-3xl mb-1">City Programs</h1>
                <p className="text-gray-600 text-sm">
                    Learn more about the city's major plans and programs
                </p>

                <div className="flex flex-wrap justify-between gap-6 mt-8">
                    {[
                        { title: "Free Wifi for All", color: "red", img: "/images/cityprograms/people.jpeg" },
                        { title: "Investments and Promotions", color: "green", img: "/images/cityprograms/iligan-port.jpg" },
                        { title: "Covid-19 Vaccination", color: "blue", img: "/images/cityprograms/vaccine.jpg" },
                        { title: "City Wide Transformation", color: "purple", img: "/images/cityprograms/iligan-port.jpg" },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`relative bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.1)),url('${card.img}')] bg-cover bg-center bg-blend-overlay bg-${card.color}-300/90 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white w-80 h-40`}
                        >
                            <h1 className="text-2xl font-extrabold [text-shadow:_2px_2px_4px_rgba(0,0,0,0.7)] mb-3">
                                {card.title}
                            </h1>
                            <button className={`bg-white rounded-md px-4 py-1 text-sm text-${card.color}-400 font-medium transform transition duration-300 hover:scale-105`}>
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// ======================== FEEDBACK ========================
function Feedback() {
    return (
        <section className="w-full text-white my-10 items-center flex justify-center">
            <div className="w-[1591px] mx-10 px-16 py-20 bg-gradient-to-r from-[#5ba3ad] to-[#488f97] flex justify-between items-center rounded-3xl relative overflow-hidden">
                {/* Background watermark text */}
                <div className="absolute right-0 bottom-0 text-white text-[120px] font-black opacity-30 leading-none pr-8 pb-4">
                    Iligan City
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-2">
                        We would like to hear from you
                    </h1>
                    <p className="text-xl">
                        Send us your feedback, comments and suggestions to help improve our services
                    </p>
                </div>
                <button className="relative z-10 bg-white rounded-full p-3 hover:scale-110 transition-transform">
                    <CircleArrowRight size={32} color="#5ba3ad" />
                </button>
            </div>
        </section>
    );
}

export default CU_HomePage;
