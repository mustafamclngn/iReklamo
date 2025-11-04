import React from 'react';
import { useLocation } from 'react-router-dom';

const HeroBanner = () => {
  const location = useLocation();
  const path = location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  const userType = segments[0] || 'superadmin';
  const page = segments[segments.length - 1] || 'dashboard';
  const isDashboard = page === 'dashboard';
  
  // hide banner for login,register pages
  if (page === 'login' || page === 'register') {
    return null;
  }

  // if page is a detail page then hide banner
  const isDetailPage = segments.length > 2 && !isNaN(segments[segments.length - 1]);
  if (isDetailPage) {
    return null;
  }

  // background images for hero banners for each user type
  const pageImages = {
    'superadmin': '/images/superadmin.jpg',
    'cityadmin': '/images/cityadmin.jpg',
    'brgycap': '/images/brgycap.jpg',
    'brgyoff': '/images/brgyoff.jpg',
  };
  
  // hero banner text in dashboard for each user type
  const getDashboardTitle = () => {
    const titles = {
      'superadmin': 'Maayong Adlaw Admin!',
      'cityadmin': 'Maayong Adlaw Admin!',
      'brgycap': 'Maayong Adlaw Cap!',
      'brgyoff': 'Maayong Adlaw Opisyal!'
    };
    return titles[userType] || 'Dashboard';
  };
  
  const title = isDashboard 
    ? getDashboardTitle()
    : page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // default image if no image found
  const backgroundImage = pageImages[userType] || '/images/default-hero.jpg';

  // hero banner and title
  return (
    <div 
      className="relative w-full max-w-[1591px] bg-cover bg-center flex items-center justify-start px-8 mx-auto overflow-hidden"
      style={{
        height: '258px',
        flexShrink: 0,
        borderRadius: '30px',
        backgroundImage: `linear-gradient(0deg, rgba(18, 62, 0, 0.5), rgba(18, 62, 0, 0.5)), url("${backgroundImage}")`,
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="relative z-10 pl-32">
        <h1 className="text-[#DFDFDF] text-6xl font-bold font-[Inter]">
          {title}
        </h1>
        {isDashboard && (
          <p className="text-[#DFDFDF] text-lg font-[Inter] mt-2">
            Himoon nato karong adlawa nga usa ka produktibo nga adlaw
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;