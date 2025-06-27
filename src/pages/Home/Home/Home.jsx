import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';

const Home = () => {
  return (
    <div>
      <section className='my-8 md:my-12'>
        <Banner></Banner>
      </section>
      <section>
        <Services></Services>
      </section>
    </div>
  );
};

export default Home;
