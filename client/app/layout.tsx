'use client';

import './globals.css';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const KEYCLOAK_BASE_URL =
  'http://localhost:8080/realms/myrealm/protocol/openid-connect';
const KEYCLOAK_SIGN_IN_URL = `${KEYCLOAK_BASE_URL}/auth`;
const KEYCLOAK_SIGN_UP_URL = `${KEYCLOAK_BASE_URL}/registrations`;
const KEYCLOAK_LOGOUT_URL = `${KEYCLOAK_BASE_URL}/logout`;
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
  const [id_token, setIDToken] = useState<string>('');
  const [refresh_token, setRefreshToken] = useState<string>('');
  const [nickname, setNickname] = useState<string | null>(null);
  useEffect(() => {
    const idToken = Cookies.get('id_token');
    if (idToken) {
      setIDToken(idToken);
      const decoded = jwt.decode(idToken) as DecodedToken;
      setNickname(decoded?.preferred_username || null);
    }
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      console.log(`refresh token: ${refreshToken}`);
      setRefreshToken(refreshToken);
    }
  }, []);

  const handleLogin = () => {
    redirect(`${KEYCLOAK_SIGN_IN_URL}?${params.toString()}`);
  };

  const handleSignUp = () => {
    redirect(`${KEYCLOAK_SIGN_UP_URL}?${params.toString()}`);
  };

  const handleLogout = async () => {
    const params = new URLSearchParams({
      client_id: 'frontend-client',
      id_token_hint: id_token,
      post_logout_redirect_uri: 'http://localhost:3000',
      refresh_token: refresh_token,
    });
    const credentials = Buffer.from(
      `frontend_client:t93DaDAB0Cib6wJq55SCmD9u7L0CoFWW`,
    ).toString('base64');
    const response = await axios.post(KEYCLOAK_LOGOUT_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      withCredentials: true,
    });

    console.log(response);
    if (response.status > 299) {
      console.log('error in page', response);
      return;
    }

    Cookies.remove('refresh_token');
    Cookies.remove('access_token');
    Cookies.remove('id_token');
    window.location.href = 'http://localhost:3000/logout';
  };

  return (
    <html lang='en'>
      <body>
        {nickname ? (
          <>
            <h1>Hello {nickname}</h1>
            <button onClick={handleLogout}>logout</button>
          </>
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
