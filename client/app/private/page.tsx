import { auth } from '@/app/auth';

export default async function Private() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>This is private page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
