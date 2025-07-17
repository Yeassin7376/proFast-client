import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';


const generateTrackingId = () => {
  const date = new Date();
  const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const number = Math.floor(1000 + Math.random() * 9000);
  return `TRK-${yyyyMMdd}-${random}${number}`;
};


const ParcelForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const {user } = useAuth();

  const warehouses = useLoaderData();

  const getUniqueRegions = () => [...new Set(warehouses.map((w) => w.region))];
  const getDistrictsByRegion = (region) => warehouses.filter((w) => w.region === region).map((w) => w.district);

  // const toastIdRef = useRef(null);
  const watchType = watch('type');
  const senderRegion = watch('sender_region');
  const receiverRegion = watch('receiver_region');

  // Helper: calculate cost + breakdown
  const getPriceBreakdown = (data) => {
    const isWithinCity = data.sender_center === data.receiver_center;
    const weight = parseFloat(data.weight || 0);
    const isDoc = data.type === 'document';

    let breakdown = [];
    let total = 0;

    if (isDoc) {
      total = isWithinCity ? 60 : 80;
      breakdown.push(`Parcel Type: Document`);
      breakdown.push(`Delivery Type: ${isWithinCity ? 'Within City' : 'Outside City'}`);
      breakdown.push(`Base Price: ৳${total}`);
    } else {
      breakdown.push(`Parcel Type: Non-Document`);
      breakdown.push(`Weight: ${weight} kg`);
      breakdown.push(`Delivery Type: ${isWithinCity ? 'Within City' : 'Outside City'}`);

      if (weight <= 3) {
        total = isWithinCity ? 110 : 150;
        breakdown.push(`Base Price: ৳${total}`);
      } else {
        const extraKg = weight - 3;
        const extraCost = extraKg * 40;
        const base = isWithinCity ? 110 : 150;

        total = base + extraCost + (isWithinCity ? 0 : 40);
        breakdown.push(`Base Price: ৳${base}`);
        breakdown.push(`Extra Weight: ${extraKg.toFixed(1)} kg × ৳40 = ৳${extraCost}`);
        if (!isWithinCity) {
          breakdown.push(`Outside City Fee: ৳40`);
        }
      }
    }

    return { breakdown, total };
  };

  // SweetAlert on Submit
  const onSubmit = (data) => {
    const { breakdown, total } = getPriceBreakdown(data);

    Swal.fire({
      title: 'Delivery Cost Breakdown',
      html: `
      <pre class="text-left" style="font-size: 14px">${breakdown.join('\n')}</pre>
      <hr />
      <p style="font-size: 18px; margin-top: 10px">
        <strong>Total: ৳${total}</strong>
      </p>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Back to Editing',
      confirmButtonColor: '#22c55e', // green
      cancelButtonColor: '#d33', // red
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(data);
      }
    });
  };

  // SweetAlert after Confirm
  const handleConfirm = (data) => {
    const { total } = getPriceBreakdown(data);
    const parcelData = {
      ...data,
      created_by: user.email,
      cost:total,
      payment_status: "unpaid",
      delivery_status: "not_collected",
      creation_date: new Date().toISOString(),
      tracking_id: generateTrackingId(), 
    };

    console.log('Saved Parcel:', parcelData);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Parcel info saved successfully.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    reset(); // ✅ Reset form after success
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Send a Parcel</h1>
      <p className="text-gray-600 mb-6">Fill out the form to send your parcel safely.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Parcel Info</h2>
          <div className="space-y-4">
            {/* Type - inline */}
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input type="radio" value="document" {...register('type', { required: true })} className="radio checked:bg-primary" />
                <span className="label-text ml-2">Document</span>
              </label>
              <label className="label cursor-pointer">
                <input type="radio" value="non-document" {...register('type', { required: true })} className="radio checked:bg-primary" />
                <span className="label-text ml-2">Non-document</span>
              </label>
            </div>

            {/* Parcel Name + Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Parcel Name</label>
                <input {...register('parcel_name', { required: true })} placeholder="Describe the parcel" className="input input-bordered w-full" />
                {errors.parcel_name && <p className="text-red-500 text-sm">Parcel name is required</p>}
              </div>

              <div>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight')}
                  className="input input-bordered w-full"
                  disabled={watchType !== 'non-document'} // ✅ Default disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender */}
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Sender Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input {...register('sender_name', { required: true })} defaultValue="John Doe" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label">Contact</label>
                <input {...register('sender_contact', { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label">Region</label>
                <select {...register('sender_region', { required: true })} className="select select-bordered w-full">
                  <option value="">Select Region</option>
                  {getUniqueRegions().map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Service Center</label>
                <select {...register('sender_center', { required: true })} className="select select-bordered w-full">
                  <option value="">Select Center</option>
                  {getDistrictsByRegion(senderRegion).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <input {...register('sender_address', { required: true })} className="input input-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Pickup Instruction</label>
                <textarea {...register('pickup_instruction', { required: true })} className="textarea textarea-bordered w-full" />
              </div>
            </div>
          </div>

          {/* Receiver */}
          <div className="bg-base-200 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Receiver Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input {...register('receiver_name', { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label">Contact</label>
                <input {...register('receiver_contact', { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label">Region</label>
                <select {...register('receiver_region', { required: true })} className="select select-bordered w-full">
                  <option value="">Select Region</option>
                  {getUniqueRegions().map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Service Center</label>
                <select {...register('receiver_center', { required: true })} className="select select-bordered w-full">
                  <option value="">Select Center</option>
                  {getDistrictsByRegion(receiverRegion).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <input {...register('receiver_address', { required: true })} className="input input-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Delivery Instruction</label>
                <textarea {...register('delivery_instruction', { required: true })} className="textarea textarea-bordered w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button type="submit" className="btn btn-primary text-black">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParcelForm;


// module-64.4