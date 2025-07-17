import React from 'react';
import { Link, NavLink } from 'react-router';
import ProfastLogo from '../ProfastLogo/ProfastLogo';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const links = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/sendParcel">Send A Parcel</NavLink></li>
      <li><NavLink to="/about">About Us</NavLink></li>
    </>
  );

  const { user, logout } = useAuth();
  // console.log(user);

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log('user logout successful');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm mt-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {' '}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />{' '}
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <ProfastLogo></ProfastLogo>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {user?.email ? (
          <button onClick={handleLogout} className="btn btn-primary text-black">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary text-black mr-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-outline hover:text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
