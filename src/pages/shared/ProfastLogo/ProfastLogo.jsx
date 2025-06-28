import React from 'react';
import logo from '../../../assets/logo.png'
import { useNavigate } from 'react-router';

const ProfastLogo = () => {

    const navigate = useNavigate();

    return (
        <div onClick={()=> navigate('/')} className='flex items-end cursor-pointer'>
            <img className='mb-2' src={logo} alt="" />
            <p className='text-3xl -ml-3'>Profast</p>
        </div>
    );
};

export default ProfastLogo;