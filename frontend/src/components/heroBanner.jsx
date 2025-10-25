import React from 'react';
import { useLocation } from 'react-router-dom';

const HeroBanner = () => {
  const location = useLocation();
  
  // images subject to change based on user type and page
  const pageImages = {
    'superadmin': {
      'dashboard': '/images/superadmin.jpg',
      'complaints': '/images/superadmin.jpg',
      'barangays': '/images/superadmin.jpg',
      'officials': '/images/superadmin.jpg',
      'reports': '/images/superadmin.jpg',
    },
    'cityadmin': {
      'dashboard': '/images/cityadmin.jpg',
      'complaints': '/images/cityadmin.jpg',
      'barangays': '/images/cityadmin.jpg',
      'officials': '/images/cityadmin.jpg',
      'reports': '/images/cityadmin.jpg',
    },
    'brgycap': {
      'dashboard': '/images/brgycap.jpg',
      'complaints': '/images/brgycap.jpg',
      'officials': '/images/brgycap.jpg',
      'reports': '/images/brgycap.jpg',
      'account': '/images/brgycap.jpg',
    },
    'brgyoff': {
      'dashboard': '/images/brgyoff.jpg',
      'assigned-complaints': '/images/brgyoff.jpg',
      'barangays': '/images/brgyoff.jpg',
      'account': '/images/brgyoff.jpg',
    },
  };
  
  // default image if no image
  const defaultImage = '/images/default-hero.jpg';
  
  const getPageInfo = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return { title: 'Dashboard', userType: 'superadmin', page: 'dashboard' };
    
    const userType = segments[0];
    const page = segments[segments.length - 1];
    
    const title = page
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { title, userType, page };
  };

  const { title, userType, page } = getPageInfo();
  
  // image for user type and filtered image
  const backgroundImage = pageImages[userType]?.[page] || defaultImage;

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
      
      <h1 className="relative z-10 text-white text-6xl font-bold font-[Inter] pl-32">
        {title}
      </h1>
    </div>
  );
};

export default HeroBanner;