'use client';

import './globals.css';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const KEYCLOAK_BASE_URL =
  'http://localhost:8080/realms/myrealm/protocol/openid-connect';
const KEYCLOAK_SIGN_IN_URL = `${KEYCLOAK_BASE_URL}/auth`;
const KEYCLOAK_SIGN_UP_URL = `${KEYCLOAK_BASE_URL}/registrations`;
const params = new URLSearchParams({
  client_id: 'frontend-client',
  redirect_uri: 'http://localhost:3000/api/callback',
  response_type: 'code',
  scope: 'openid profile email',
});

type DecodedToken = {
  preferred_username?: string;
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [nickname, setNickname] = useState<string | null>(null);
  useEffect(() => {
    const token = Cookies.get('id_token');
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setNickname(decoded?.preferred_username || null);
    }
  }, []);

  const handleLogin = () => {
    redirect(`${KEYCLOAK_SIGN_IN_URL}?${params.toString()}`);
  };

  const handleSignUp = () => {
    redirect(`${KEYCLOAK_SIGN_UP_URL}?${params.toString()}`);
  };

  return (
    <html lang='en'>
      <body>
        {nickname ? (
          <h1>Hello {nickname}</h1>
        ) : (
          <>
            <button onClick={handleLogin}>login</button>
            <button onClick={handleSignUp}>register</button>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
