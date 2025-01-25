import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { handleLogin, handleSignUp } from './authNavigation';
import { handleLogout } from './logout';

type DecodedToken = {
  preferred_username?: string;
};

export const useAuth = () => {
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
      setRefreshToken(refreshToken);
    }
  }, []);

  return {
    id_token,
    refresh_token,
    nickname,
    handleLogin,
    handleSignUp,
    handleLogout,
  };
};
