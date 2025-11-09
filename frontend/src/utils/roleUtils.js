export const getRoleBasePath = (auth) => {
  const role = auth?.user?.role || auth?.role?.[0];
  
  switch (role) {
    case 1: 
      return '/superadmin';
    case 2: 
      return '/cityadmin';
    case 3: 
      return '/brgycap';
    case 4: 
      return '/brgyoff';
    default: 
      return '/';
  }
};

// pwede mabutang diri tong sa redirect para muredirect balik sa dashboard ang admin etc. magbutang sa tag logout