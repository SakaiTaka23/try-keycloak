import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { getPublicKey } from './key';

type tokens = {
  id_token: string;
  refresh_token: string;
  access_token: string;
};

export const getTokens = async () => {
  const id = getIDToken();
const refresh = await getRefreshToken();
    let access  = '';  
    if (refresh) {
      const accessToken = await getAccessToken(refresh);
      access = accessToken ?? '';
    }

  return {
    id_token: id,
    refresh_token: refresh,
    access_token: access,
  } as tokens;
};

const getIDToken = () => {
  const idToken = Cookies.get('id_token');
  if (idToken) {
    return idToken;
  } else {
    return '';
  }
};

const getRefreshToken = async () => {
  const refreshToken = Cookies.get('refresh_token');
  if (!refreshToken) {
    return '';
  }

  const decoded = jwt.decode(refreshToken, { complete: true });
  if (!decoded || typeof decoded === 'string') {
    return '';
  }
  const kid = decoded.header.kid;
  if (!kid) {
    return '';
  }

  const publicKey = await getPublicKey(kid);

  jwt.verify(refreshToken, publicKey, (err) => {
    if (err) {
      // todo: try to refresh token
      console.log(err);
      return '';
    } else {
      console.log('ok', refreshToken);
      return refreshToken;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAccessToken = async (_: string) => {
  const accessToken = Cookies.get('access_token');
  if (!accessToken) {
    return '';
  }

  const decoded = jwt.decode(accessToken, { complete: true });
  if (!decoded || typeof decoded === 'string') {
    return '';
  }
  const kid = decoded.header.kid;
  if (!kid) {
    return '';
  }

  const publicKey = await getPublicKey(kid);

  jwt.verify(accessToken, publicKey, (err) => {
    if (err) {
      // todo: try to refresh token
      console.log(err);
      return '';
    } else {
      console.log('ok', accessToken);
      return accessToken;
    }
  });
};
