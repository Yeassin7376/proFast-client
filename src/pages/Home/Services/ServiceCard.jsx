// src/components/ServiceCard.jsx
import React from 'react';

const ServiceCard = ({ service }) => {
    const {icon: Icon, title, description} = service; 
  return (
    <div  className="bg-white shadow-md rounded-2xl p-6 
    flex flex-col items-center text-center gap-4 
    hover:shadow-xl transition-all duration-300 
    hover:bg-[#CAEB66]">
      <div  className="text-5xl p-5 rounded-full bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-300   group-hover:text-white transition-colors">
        <Icon />
      </div>
      <h3 className="text-xl font-semibold text-[#03373D] ">{title}</h3>
      <p className="text-sm text-[#606060]">{description}</p>
    </div>
  );
};

export default ServiceCard;
