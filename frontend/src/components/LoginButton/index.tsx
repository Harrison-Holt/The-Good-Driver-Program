// src/components/LoginButton.tsx
import React from 'react';

const LoginButton: React.FC = () => {
  const cognitoUrl = "https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d3ggpwrnl4m4is.amplifyapp.com%2F"; // Replace with your actual Cognito URL

  const handleLogin = () => {
    window.location.href = cognitoUrl;  // Redirect to Cognito login URL
  };

  return (
    <button onClick={handleLogin}>Login</button>
  );
};

export default LoginButton;
