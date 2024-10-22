// src/pages/Login.tsx
import React from 'react';
import LoginButton from '../../components/LoginButton';  // Import the LoginButton component

const Login: React.FC = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginButton />  {/* Use the existing LoginButton component */}
    </div>
  );
};

export default Login;