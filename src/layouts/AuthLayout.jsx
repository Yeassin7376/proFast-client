import React from 'react';
import authImg from '../assets/authImage.png';
import { Outlet } from 'react-router';
import ProfastLogo from '../pages/shared/ProfastLogo/ProfastLogo';

const AuthLayout = () => {
  return (
    <div className=" p-0 ">
      <div className="p-5 md:p-12">
        <ProfastLogo></ProfastLogo>
      </div>
      <div className="hero-content flex-col md:flex-row-reverse p-0 items-start">
        <div className="flex-1 flex justify-center items-center w-full bg-[#FAFDF0] md:px-14 md:py-44">
          <img src={authImg} className="max-w-sm rounded-lg " />
        </div>

        <div className="flex-1 p-12 flex justify-center">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
