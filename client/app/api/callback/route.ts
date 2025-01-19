import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const keycloakTokenUrl = `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token`;
const clientId = process.env.KEYCLOAK_CLIENT;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/api/callback';

type authenticationResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' });
  }

  const response: AxiosResponse<authenticationResponse> = await axios.post(
    keycloakTokenUrl,
    {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'openid profile email',
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  if (response.status > 299) {
    return NextResponse.json({ error: 'error during getting access token' });
  }

  const tokens = response.data;
  console.log(tokens);
  const res = NextResponse.redirect('http://localhost:3000');
  res.cookies.set('refresh_token', tokens.refresh_token, {
    httpOnly: true,
    secure: true,
  });
  res.cookies.set('access_token', tokens.access_token, {
    httpOnly: true,
    secure: true,
  });
  res.cookies.set('id_token', tokens.id_token);

  return res;
}
