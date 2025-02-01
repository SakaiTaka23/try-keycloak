import { redirect } from 'next/navigation';
import { KEYCLOAK_BASE_URL } from '../links';

export const KEYCLOAK_SIGN_IN_URL = `${KEYCLOAK_BASE_URL}/auth`;
export const KEYCLOAK_SIGN_UP_URL = `${KEYCLOAK_BASE_URL}/registrations`;

const params = new URLSearchParams({
  client_id: `${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT}`,
  redirect_uri: 'http://localhost:3000/api/callback',
  response_type: 'code',
  scope: 'openid profile email',
});

export const handleLogin = () => {
  redirect(`${KEYCLOAK_SIGN_IN_URL}?${params.toString()}`);
};

export const handleSignUp = () => {
  redirect(`${KEYCLOAK_SIGN_UP_URL}?${params.toString()}`);
};
