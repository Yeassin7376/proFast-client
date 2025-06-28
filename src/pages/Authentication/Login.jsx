import React from 'react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-1/2 ">
      <h1 className="text-4xl font-bold mb-1">Welcome Back</h1>
      <p className="text-gray-400 mb-3">Login with Profast</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email Address is required' })}
            aria-invalid={errors.email ? 'true' : 'false'}
            className="input"
            placeholder="Email"
          />
          {errors.email && (
            <p role="alert" className="text-red-500">
              {errors.email.message}
            </p>
          )}

          <label className="label">Password</label>
          <input
            type="password"
            {...register('password', { required: 'password required', minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === 'required' && <p className="text-red-500">{errors.password.message}</p>}
          {errors.password?.type === 'minLength' && (
            <p className="text-red-500">Password should be more then 6 characters</p>
          )}

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>

          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
