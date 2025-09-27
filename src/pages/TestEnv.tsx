import CONF from '@/conf';

export default function TestEnv() {
  const envVars = {
    APPWRITE_URL: CONF.get('APPWRITE_URL'),
    APPWRITE_PROJECT_ID: CONF.get('APPWRITE_PROJECT_ID'),
    APPWRITE_DATABASE_ID: CONF.get('APPWRITE_DATABASE_ID'),
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Check</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      <p className="mt-4">
        Check the browser console for any errors when loading this page.
      </p>
    </div>
  );
}