import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material"
import { getSession } from '../../utils/cognitoAuth';  // Import session checker

const LoginButton: React.FC = () => {
const cognitoUrl = "https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmaster.d3ggpwrnl4m4is.amplifyapp.com%2Fauth-callback";
 
//anthony branch
//const cognitoUrl = "https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fanthony-test-branch.d3ggpwrnl4m4is.amplifyapp.com%2Fauth-callback";

//const cognitoUrl = "https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fconner-working.d3ggpwrnl4m4is.amplifyapp.com%2Fauth-callback";
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
        console.error(error); 
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (!isAuthenticated) {
    const handleLogin = () => {
      window.location.href = cognitoUrl;
    };

    return (
      <Button
        variant="contained"
        onClick={handleLogin}>Login
      </Button>
    );
  } else {
    const handleLogin = () => {
      window.location.href = "/";
    };

    return (
      <Button
        variant="contained"
        onClick={handleLogin}>Logout
      </Button>
    );
  }
};

export default LoginButton;
