'use client';

import './globals.css';
import React from 'react';
import { AuthProvider, useAuthContext } from '@auth/logic/authContext';

const AuthContent = () => {
  const {
    nickname,
    id_token,
    refresh_token,
    handleLogin,
    handleSignUp,
    handleLogout,
  } = useAuthContext();

  const onLogout = async () => {
    await handleLogout(id_token, refresh_token);
  };

  return (
    <>
      {nickname ? (
        <>
          <h1>Hello {nickname}</h1>
          <button onClick={onLogout}>logout</button>
        </>
      ) : (
        <>
          <button onClick={handleLogin}>login</button>
          <button onClick={handleSignUp}>register</button>
        </>
      )}
    </>
  );
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <AuthContent />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
