import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroBannerHome = () => {
  const navigate = useNavigate();
  
  const slides = [
    {
      id: 1,
      title: "Bisita Iligan",
      subtitle: "EXPLORE OUR BEAUTY AND BOUNTY",
      text: "Iligan city is a melting bowl of interfaith and intercultural community. Its population of 366,000, with at least 8 major ethnic speakers of Cebuano, Bisaya, Maranao, Hiligaynon, Tagalog, Ilocano, Tausug, and other 25 tribal speaking communities.",
      image: "/images/home.jpg",
    },
    {
      id: 2,
      title: "Preparedness",
      subtitle: "WE REDUCE DISASTER RISKS THROUGH",
      text: "Iligan City Disaster Risk Reduction and Management Office tasked to develop, promote and implement a comprehensive Local Disaster Risk Reduction and Management plan (LDRRMP).",
      image: "/images/ndrrmc.jpg",
    },
    {
      id: 3,
      title: "Culture",
      subtitle: "Discover what the city can offer",
      text: "Immerse yourself in the rich culture and vibrant traditions of Iligan City, a place where history, faith, and community intertwine to foster unity, resilience, and continuous progress for every Iliganon.",
      image: "/images/culture.jpg",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  // slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleActionChange = (e) => {
    const value = e.target.value;
    if (value) {
      // navigate to complainant info when choosing file-complaint (shorthand used elsewhere)
      if (value === "file-complaint") {
        navigate(`/file-complaint/complainantinfo`);
      } else {
        navigate(`/${value}`);
      }
    }
  };

  return (
    <div className="bg-white pt-0 pb-8">
      <div className="max-w-[1591px] mx-auto px-8">
        <div
          className="relative w-full h-[600px] bg-cover bg-center rounded-3xl overflow-hidden shadow-xl transition-all duration-700"
          style={{
            backgroundImage: `url('${slides[activeSlide].image}')`,
          }}
        >
          <div className="absolute inset-0 flex items-center bg-black/20 transition-all duration-700">
            <div className="px-16 max-w-3xl">
              <p className="text-white text-3xl uppercase font-bold">
                {slides[activeSlide].subtitle}
              </p>
              <h1 className="text-white text-7xl font-black mb-4 leading-tight">
                {slides[activeSlide].title}
              </h1>
              <p className="text-white text-[17px] mb-8 leading-relaxed">
                {slides[activeSlide].text}
              </p>

              <div className="flex gap-4 mb-8">
                <button className="bg-[#FFA500] hover:bg-[#FF8C00] text-white px-13 py-3 rounded-2xl font-bold transition-colors w-64">
                  EXPLORE ILIGAN CITY
                </button>
                <button className="border-2 border-white text-white px-13 py-3 rounded-2xl font-bold transition-colors hover:bg-white hover:text-black w-64">
                  CONTACT US
                </button>
              </div>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-20 h-1 transition-all duration-300 ${
                      activeSlide === index
                        ? "bg-[#FFFF00] w-24"
                        : "bg-white/60 hover:bg-white/90"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-b-3xl -mt-2 pt-8 pb-8 px-16 shadow-lg">
          <div className="flex items-center justify-center gap-10">
            <label className="text-gray-900 text-[22px] font-semibold">
              What would you like to do
            </label>
            <select 
              className="w-[700px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#578fe0] appearance-none"
              onChange={handleActionChange}
              defaultValue=""
            >
              <option value="">I WANT TO...</option>
              <option value="file-complaint">FILE A COMPLAINT</option>
              <option value="track-complaint">TRACK MY COMPLAINT</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerHome;