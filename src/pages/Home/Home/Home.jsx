import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientSlider from '../ClientSlider/ClientSlider';
import Benefits from '../Benefits/Benefits';
import BeMerchant from '../BeMerchant/BeMerchant';

const Home = () => {
  return (
    <div>
      <section className='my-8 md:my-12'>
        <Banner></Banner>
      </section>
      <section className='mb-10 md:mb-14'>
        <Services></Services>
      </section>
      <section  className='mb-10 md:mb-14'>
        <ClientSlider></ClientSlider>
      </section>
      <section>
        <Benefits></Benefits>
      </section>
      <section  className='mb-10 md:mb-14'>
        <BeMerchant></BeMerchant>
      </section>
    </div>
  );
};

export default Home;
