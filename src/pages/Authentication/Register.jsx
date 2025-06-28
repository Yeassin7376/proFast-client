import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const Register = () => {
    const {register, handleSubmit, formState:{errors}} = useForm();

    const onSubmit = data =>{
        console.log(data)
    }

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">

            <label className="label">Email</label>
            <input type="email" {...register('email', {required: true})} className="input" placeholder="Email" />
            {errors.email?.type === 'required' && <p className='text-red-500'>Email is Required</p>}

            <label className="label">Password</label>
            <input type="password" {...register("password", {required:true, minLength:6})} className="input" placeholder="Password" />
            {errors.password?.type == 'required' && <p className='text-red-500'>Password is Required</p>}
            {errors.password?.type == 'minLength' && <p className='text-red-500'>Password must be longer then 6 characters</p>}

            <button className="btn btn-neutral mt-4">Login</button>
            <div>
              <p className="">
                Already have an account ? Please{' '}
                <Link to="/login" className="text-blue-500 underline">
                  Login
                </Link>
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Register;
