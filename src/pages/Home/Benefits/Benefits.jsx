// src/components/Benefits.jsx
import React from 'react';
import tracking from '../../../assets/live-tracking.png';
import delivery from '../../../assets/safe-delivery.png';

// ✅ Local benefit data
const benefits = [
  {
    id: 1,
    title: 'Live Parcel Tracking',
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: tracking
  },
  {
    id: 2,
    title: '100% Safe Delivery',
    description:
      'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
    image: delivery
  },
  {
    id: 3,
    title: '24/7 Call Center Support',
    description:
      'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
    image: delivery
  }
];

const Benefits = () => {
  return (
    <div className="bg-base-100 py-16 ">
      <div className="w-full mx-auto space-y-10">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="card bg-white shadow-xl w-full p-8">
            <div  className="flex flex-col lg:flex-row items-center">
              {/* Image */}
              <figure className=" max-h-80 overflow-hidden">
                <img src={benefit.image} alt={benefit.title} className="w-48 h-48 object-cover" />
              </figure>

              {/* Vertical Divider */}
              <div className="hidden lg:block h-40  border-r-2 border-dashed border-gray-400 m-12"></div>

              {/* Content */}
              <div className="card-body lg:w-1/2 justify-center">
                <h2 className="card-title text-blue-10">{benefit.title}</h2>
                <p className="text-sm text-black-8">{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
