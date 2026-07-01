export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <div>
      <h1>Proxy Test Page</h1>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>This page is forced to be dynamic.</p>
    </div>
  );
}
