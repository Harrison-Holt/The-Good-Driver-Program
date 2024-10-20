// src/components/AuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // You can use fetch or axios to make the token request

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
            client_id: 'ff8qau87sidn42svsuj51v4l4',  // Replace with your actual Client ID
            code: code,  // Authorization code from the URL
            redirect_uri: 'https://dev.d3ggpwrnl4m4is.amplifyapp.com/',  // Same redirect URI
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token, id_token, refresh_token } = response.data;
          console.log('Access Token:', access_token);
          console.log('ID Token:', id_token);
          console.log('Refresh Token:', refresh_token);

          // Here, you can store the tokens in local storage or manage them in the state
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

  return <div>Loading...</div>;
};

export default AuthCallback;
