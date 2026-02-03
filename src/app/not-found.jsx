import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center p-8">
        <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">
          404
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
