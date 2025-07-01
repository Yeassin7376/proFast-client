import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { createUser } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
            {errors.email?.type === 'required' && <p className="text-red-500">Email is Required</p>}

            <label className="label">Password</label>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type == 'required' && <p className="text-red-500">Password is Required</p>}
            {errors.password?.type == 'minLength' && (
              <p className="text-red-500">Password must be longer then 6 characters</p>
            )}

            <button className="btn btn-primary text-black mt-4">Register</button>
            <div>
              <p>
                <small className="text-gray-600 md:font-medium md:text-sm">
                  Already have an account ? Please{' '}
                  <Link to="/login" className="btn btn-link p-0">
                    Login
                  </Link>
                </small>
              </p>
            </div>
          </fieldset>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
