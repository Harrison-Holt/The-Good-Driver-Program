import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');  // Get the code from the URL

      if (code) {
        try {
          // Exchange the authorization code for tokens
          const response = await axios.post('https://team08-domain.auth.us-east-1.amazoncognito.com/oauth2/token', new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: 'ff8qau87sidn42svsuj51v4l4',
            code: code,
            //redirect_uri: 'https://master.d3ggpwrnl4m4is.amplifyapp.com/auth-callback',  // MUST MATCH Cognito's callback URL
            redirect_uri: 'https://conner-working.d3ggpwrnl4m4is.amplifyapp.com/auth-callback',
            // for anthony's branch
            //redirect_uri: 'https://tradd.d3ggpwrnl4m4is.amplifyapp.com/auth-callback',
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token, id_token, refresh_token } = response.data;

          // Clear any old tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('idToken');
          localStorage.removeItem('refreshToken');

          // Store the new tokens
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('idToken', id_token);
          localStorage.setItem('refreshToken', refresh_token);

          // Redirect to homepage or other page after successful login
          navigate('/');
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
        }
      } else {
        console.error('No authorization code found');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <div></div>; //gives out a blank page while loading (very quick load time anyway)
};

export default AuthCallback;
