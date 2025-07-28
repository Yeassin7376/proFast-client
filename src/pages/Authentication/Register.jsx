import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAxios from '../../hooks/useAxios';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { createUser, updataUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const [profilePic, setProfilePic] = useState('');
  const axiosInstant = useAxios();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async(result) => {
        // console.log(result.user);

        // updata profile in database
        const userInfo ={
          email: data.email,
          role: 'user', //default role
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }

        const useRes = await axiosInstant.post('/users', userInfo);
        console.log(useRes);


        // update profile in firebase
        const profileInfo ={
          displayName:data.name,
          photoURL:profilePic
        }
        // console.log(profileInfo)
        updataUserProfile(profileInfo)
          .then(() => {
            // console.log('user profile pic and name updated')
          }).catch((err) => {
            console.log(err)
          });

        navigate(from);
        toast.success('User created successful');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.code);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    // console.log(image);

    const formdata = new FormData();
    formdata.append('image', image);

    const imageUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    const res = await axios.post(imageUploadURL, formdata);

    setProfilePic(res.data.data.url);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Your name</label>
            <input type="text" {...register('name', { required: true })} className="input" placeholder="Your name" />
            {errors.name?.type === 'required' && <p className="text-red-500">Name is Required</p>}

            {/* Image */}
            <label className="label">Image</label>
            <input type="file" onChange={handleImageUpload} className="input" placeholder="Your Profile Picture" />

            {/* Email */}
            <label className="label">Email</label>
            <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
            {errors.email?.type === 'required' && <p className="text-red-500">Email is Required</p>}

            {/* password */}
            <label className="label">Password</label>
            <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
            {errors.password?.type == 'required' && <p className="text-red-500">Password is Required</p>}
            {errors.password?.type == 'minLength' && <p className="text-red-500">Password must be longer then 6 characters</p>}

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
