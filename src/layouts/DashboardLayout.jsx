import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProfastLogo from '../pages/shared/ProfastLogo/ProfastLogo';
import { FaHome, FaBoxOpen, FaHistory, FaMapMarkedAlt, FaUserEdit, FaMotorcycle, FaClock, FaUserShield, FaUserTie } from 'react-icons/fa';
import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'}`;

  const { role, isRoleLoading } = useUserRole();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <ProfastLogo></ProfastLogo>
          <li>
            <NavLink to="/dashboard" end className={navLinkStyle}>
              <FaHome className="text-lg" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myParcels" className={navLinkStyle}>
              <FaBoxOpen className="text-lg" />
              My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymentHistory" className={navLinkStyle}>
              <FaHistory className="text-lg" />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track" className={navLinkStyle}>
              <FaMapMarkedAlt className="text-lg" />
              Track a Package
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" className={navLinkStyle}>
              <FaUserEdit className="text-lg" />
              Update Profile
            </NavLink>
          </li>

          {/* riders link */}
          {!isRoleLoading && role === 'admin' && (
            <>
              <li>
                <NavLink to="/dashboard/assignRider" className={navLinkStyle}>
                  <FaUserTie className="text-lg" />
                  Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/activeRiders" className={navLinkStyle}>
                  <FaMotorcycle className="text-lg" />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/pendingRiders" className={navLinkStyle}>
                  <FaClock className="text-lg" />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/makeAdmin" className={navLinkStyle}>
                  <FaUserShield className="text-lg" />
                  Make Admin
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
