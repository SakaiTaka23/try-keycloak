import axios from 'axios';
import Cookies from 'js-cookie';
import { KEYCLOAK_BASE_URL } from '../links';

const KEYCLOAK_LOGOUT_URL = `${KEYCLOAK_BASE_URL}/logout`;

export const handleLogout = async (id_token: string, refresh_token: string) => {
  const params = new URLSearchParams({
    client_id: `${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT}`,
    id_token_hint: id_token,
    post_logout_redirect_uri: 'http://localhost:3000',
    refresh_token: refresh_token,
  });
  const credentials = Buffer.from(
    `${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT}:${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET}`,
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
