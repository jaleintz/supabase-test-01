'use client';

import { useState, useEffect } from 'react';

interface UrlEntry {
  url: string;
  addedAt: string;
}

export default function DisplayUrls() {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/urls');
      const data = await response.json();

      if (response.ok) {
        setUrls(data);
      } else {
        setError(data.error || 'Failed to fetch URLs');
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (urlToDelete: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      const response = await fetch('/api/urls', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToDelete }),
      });

      if (response.ok) {
        setUrls(urls.filter(item => item.url !== urlToDelete));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete URL');
      }
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete URL');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          All URLs
        </h1>

        {urls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">No URLs added yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {urls.map((urlItem, index) => (
                <li key={index} className="px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <a
                        href={urlItem.url.startsWith('http') ? urlItem.url : `https://${urlItem.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {urlItem.url}
                      </a>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Added: {new Date(urlItem.addedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(urlItem.url)}
                      className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
