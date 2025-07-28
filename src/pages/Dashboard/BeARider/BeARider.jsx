// BeARider.jsx
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useWarehouseData from "../../../hooks/useWarehouseData";

const BeARider = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const { warehouses, regions } = useWarehouseData();

  const selectedRegion = watch("region");
  const filteredCenters = warehouses?.filter(center => center.region === selectedRegion);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName,
      email: user?.email,
      status: "pending",
      application_date: new Date()
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);
      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your application is under review."
        });
        reset();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.message || "Something went wrong"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Become a Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* name */}
        <input
          type="text"
          className="input input-bordered w-full"
          value={user?.displayName || ""}
          readOnly
          {...register("name")}
        />
        {/* email */}
        <input
          type="email"
          className="input input-bordered w-full"
          value={user?.email || ""}
          readOnly
          {...register("email")}
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Your Age"
          {...register("age", { required: true })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Select Region</label>
            <select className="select select-bordered w-full" {...register("region", { required: true })}>
              <option value="">Select Region</option>
              {regions?.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Select District</label>
            <select className="select select-bordered w-full" {...register("district", { required: true })}>
              <option value="">Select District</option>
              {filteredCenters?.map(center => (
                <option key={center._id} value={center.district}>{center.district}</option>
              ))}
            </select>
          </div>
        </div>

        <input
          type="tel"
          className="input input-bordered w-full"
          placeholder="Phone Number"
          {...register("phone", { required: true })}
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="National ID Card Number"
          {...register("nid", { required: true })}
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Bike Brand (e.g. Honda, Bajaj)"
          {...register("bike_brand", { required: true })}
        />

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Bike Registration Number"
          {...register("bike_registration", { required: true })}
        />

        <button type="submit" className="btn btn-primary text-black w-full">Submit Application</button>
      </form>
    </div>
  );
};

export default BeARider;
