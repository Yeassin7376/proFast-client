import React from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-[calc(100vh-356px)] flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-md p-6 bg-base-100 rounded-lg shadow-md">
        <div className="flex justify-center text-red-500 text-5xl mb-4">
          <FaLock />
        </div>
        <h1 className="text-4xl font-bold mb-2">403 - Forbidden</h1>
        <p className="text-gray-500 mb-4">
          You don’t have permission to access this page.
        </p>

        <Link to="/" className="btn btn-primary text-black">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
