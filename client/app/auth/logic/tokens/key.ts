import { JwksClient } from 'jwks-rsa';
import { KEYCLOAK_BASE_URL } from '../links';

const KEYCLOAK_CERT_URL = `${KEYCLOAK_BASE_URL}/certs`;
const CERT_STORE_KEY = `public_keys`;

// kid:key
type storedKeys = {
  [kid: string]: string;
};

export const getPublicKey = async (kid: string) => {
  const publicKeys = localStorage.getItem(CERT_STORE_KEY);
  if (publicKeys) {
    const keys: storedKeys = JSON.parse(publicKeys);
    if (keys[kid]) {
      return keys[kid];
    }
  }

  const client = new JwksClient({
    jwksUri: KEYCLOAK_CERT_URL,
  });
  const keys = await client
    .getSigningKeys()
    .then((keys) => {
      const storedKeys: storedKeys = {};
      keys.forEach((key) => {
        storedKeys[key.kid] = key.getPublicKey();
      });
      return storedKeys;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

    if (typeof window !== 'undefined') {
        localStorage.setItem(CERT_STORE_KEY, JSON.stringify(keys));
    }

  return keys[kid];
};
