import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link to="/" className="btn-primary mt-6 inline-block">Go home</Link>
    </div>
  );
}