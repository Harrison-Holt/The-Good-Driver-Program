import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../../utils/cognitoAuth';  // Import session checker

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session.isValid()) {  
          setIsAuthenticated(true);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) { 
        console.error("Error", error); 
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
