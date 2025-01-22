import { signIn, signOut } from '@/app/auth';

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <SignIn />
      <SignOut />
    </>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('keycloak');
      }}
    >
      <button type='submit'>Signin with Keycloak</button>
    </form>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type='submit'>Sign Out</button>
    </form>
  );
}
