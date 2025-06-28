// src/sections/ClientSlider.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';

import amazon from '../../../assets/brands/amazon.png'
import amazon_vector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import start from '../../../assets/brands/start.png';
import start_people from '../../../assets/brands/start-people 1.png';

const logos = [
  amazon,
  amazon_vector,
  casio,
  moonstar,
  randstad,
  start,
  start_people,
];

const ClientSlider = () => {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-[#03373D]">
        We've helped thousands of sales teams
        </h2>
      </div>

      <Marquee
        gradient={false}
        speed={60}
        pauseOnHover={true}
        className="py-4"
      >
        {logos.map((logo, index) => (
          <div key={index} className="mx-24 flex items-center justify-center">
            <img
              src={logo}
              alt="Client Logo"
              className="h-6 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientSlider;
