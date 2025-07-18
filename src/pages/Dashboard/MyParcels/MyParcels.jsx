import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { format } from 'date-fns';
import { FaEye, FaTrash, FaMoneyBillAlt } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], refetch} = useQuery({
    queryKey: ['my-parcels', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  });
  console.log(parcels);

  const handleView = (parcel) => {
    console.log('Viewing parcel', parcel);
    // open modal or route to details page
  };

  const handlePay = (parcel) => {
    console.log('Paying for parcel', parcel);
    // open payment modal or redirect
  };

  const handleDelete = async (parcel) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete parcel: "${parcel.parcel_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        axiosSecure.delete(`/parcels/${parcel._id}`).then((res) => {
            console.log(res.data)
          if (res.data.deletedCount) {
            Swal.fire({
              title: 'Deleted!',
              text: 'The parcel has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            refetch();
          } else {
            throw new Error('Failed to delete');
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Could not delete the parcel.',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-base-300">
      <table className="table w-full">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Parcel Name</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td className="font-medium max-w-[180px] truncate">{parcel.parcel_name}</td>
              <td className="capitalize">{parcel.type}</td>
              <td>{format(new Date(parcel.creation_date), 'PPPp')}</td>
              <td>৳{parcel.cost}</td>
              <td>
                <span className={`badge text-white ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>{parcel.payment_status}</span>
              </td>
              <td className="flex gap-2">
                <button className="btn btn-sm btn-info tooltip" data-tip="View Details" onClick={() => handleView(parcel)}>
                  <FaEye />
                </button>
                <button className="btn btn-sm btn-success tooltip" data-tip="Pay" disabled={parcel.payment_status === 'paid'} onClick={() => handlePay(parcel)}>
                  <FaMoneyBillAlt />
                </button>
                <button className="btn btn-sm btn-error tooltip" data-tip="Delete" onClick={() => handleDelete(parcel)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {parcels.length === 0 && <div className="text-center py-10 text-gray-500">No parcels found.</div>}
    </div>
  );
};

export default MyParcels;
