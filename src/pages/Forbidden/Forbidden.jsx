import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 text-center px-6">
      {/* Icon */}
      <div className="bg-red-100 p-6 rounded-full shadow-md">
        <ShieldAlert className="w-16 h-16 text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-6">
        Access Forbidden
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-3 max-w-md">
        Sorry, you don’t have permission to view this page. Please check your
        account role or return to the home page.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all"
      >
        Go Back Home
      </Link>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">
        Parcel Delivery App © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Forbidden;
