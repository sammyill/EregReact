
import { NavLink } from "react-router-dom";
export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Oops! Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Looks like this cat knocked over the page you're looking for.
      </p>

      <div className="w-64 md:w-80 mb-8">
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FEC260" d="M256 32C150 32 96 106 96 184c0 48 32 88 56 104v32h208v-32c24-16 56-56 56-104 0-78-54-152-160-152z"/>
          <circle cx="176" cy="184" r="16" fill="#333"/>
          <circle cx="336" cy="184" r="16" fill="#333"/>
          <path d="M208 248c16 16 48 16 64 0" stroke="#333" strokeWidth="4" strokeLinecap="round"/>
          <path d="M96 184c-24-8-40-40-32-72 16-48 64-16 72 8" stroke="#333" strokeWidth="4"/>
          <path d="M416 184c24-8 40-40 32-72-16-48-64-16-72 8" stroke="#333" strokeWidth="4"/>
        </svg>
      </div>

      <NavLink
        to="/"
        className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Go Home
      </NavLink>
    </div>
  );
}
