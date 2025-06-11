'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment-500 dark:bg-midnight-green-500 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-midnight-green-500 dark:text-parchment-500">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}
          <div className="-space-y-px rounded-md">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full rounded-t-md px-3 py-1.5 text-midnight-green-500 dark:text-parchment-500 bg-tea-green-300 dark:bg-midnight-green-400 border-0 ring-1 ring-inset ring-celadon-300 dark:ring-midnight-green-300 placeholder:text-midnight-green-400 dark:placeholder:text-tea-green-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-sea-green-500 dark:focus:ring-sea-green-400 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md px-3 py-1.5 text-midnight-green-500 dark:text-parchment-500 bg-tea-green-300 dark:bg-midnight-green-400 border-0 ring-1 ring-inset ring-celadon-300 dark:ring-midnight-green-300 placeholder:text-midnight-green-400 dark:placeholder:text-tea-green-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-sea-green-500 dark:focus:ring-sea-green-400 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-sea-green-500 dark:bg-sea-green-400 px-3 py-2 text-sm font-semibold text-parchment-500 dark:text-midnight-green-500 hover:bg-sea-green-600 dark:hover:bg-sea-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea-green-500 dark:focus-visible:outline-sea-green-400 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}