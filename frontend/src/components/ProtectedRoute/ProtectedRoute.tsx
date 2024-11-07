import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../../utils/cognitoAuth';  // Import session checker

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();  // getSession returns CognitoUserSession
        if (session.isValid()) {  // Use session.isValid() to check session validity
          setIsAuthenticated(true);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {  // Handle the error as `unknown`
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
