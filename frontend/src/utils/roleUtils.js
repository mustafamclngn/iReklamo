export const getRoleBasePath = (auth) => {
  const role = auth?.user?.role || auth?.roles?.[0];
  
  switch (role) {
    case 'super_admin': 
      return '/superadmin';
    case 'city_admin': 
      return '/cityadmin';
    case 'brgy_cap': 
      return '/brgycap';
    case 'brgy_off': 
      return '/brgyoff';
    default: 
      return '/';
  }
};

// pwede mabutang diri tong sa redirect para muredirect balik sa dashboard ang admin etc. magbutang sa tag logout