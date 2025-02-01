import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { handleLogin, handleSignUp } from './userAction/authEntry';
import { handleLogout } from './userAction/logout';
import { getTokens } from './tokens/getter';

type DecodedToken = {
  preferred_username?: string;
};

export const useAuth = () => {
  const [id_token, setIDToken] = useState<string>('');
  const [refresh_token, setRefreshToken] = useState<string>('');
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const tokens = await getTokens();
      const idToken = tokens.id_token;
      setIDToken(idToken);
      if (idToken != '') {
        const decoded = jwt.decode(idToken) as DecodedToken;
        setNickname(decoded?.preferred_username || null);
      }
      setRefreshToken(tokens.refresh_token);
    }

    fetchTokens().catch(console.error);
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
