import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['assignableParcels'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/?payment_status=paid&delivery_status=not_collected');
      return res.data;
    }
  });

  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    try {
      const res = await axiosSecure.get(`/riders/byDistrict?district=${parcel.sender_center}`);
      setRiders(res.data);
    } catch (error) {
      console.error('Failed to load riders', error);
    } finally {
      setLoadingRiders(false);
      document.getElementById('assignModal').showModal();
    }
  };

  const assignMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      const res = await axiosSecure.patch(`/parcels/assign/${parcelId}`, {
        riderId
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Rider Assigned',
        text: 'Parcel is now marked as in-transit.'
      });
      document.getElementById('assignModal')?.close();
      queryClient.invalidateQueries(['assignableParcels']);
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'Could not assign the rider. Please try again.'
      });
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign Rider to Parcels</h2>

      {isLoading ? (
        <div className="text-center py-10">Loading parcels...</div>
      ) : parcels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No parcels available for rider assignment.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Type</th>
                <th>Sender Center</th>
                <th>Receiver Center</th>
                <th>Cost</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.parcel_name}</td>
                  <td>{parcel.type}</td>
                  <td>{parcel.sender_center}</td>
                  <td>{parcel.receiver_center}</td>
                  <td>৳{parcel.cost}</td>
                  <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-accent" onClick={() => handleAssignClick(parcel)}>
                      <FaUserPlus className="mr-2" />
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Rider Modal */}
      <dialog id="assignModal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Assign Rider</h3>
          {loadingRiders ? (
            <p>Loading available riders...</p>
          ) : riders.length === 0 ? (
            <p className="text-error">No active riders found in {selectedParcel?.sender_center}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Bike</th>
                    <th>Registration</th>
                    <th>National ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider) => (
                    <tr key={rider._id}>
                      <td>{rider.name}</td>
                      <td>{rider.phone}</td>
                      <td>{rider.bike_brand}</td>
                      <td>{rider.bike_registration}</td>
                      <td>{rider.nid}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            assignMutation.mutate({
                              parcelId: selectedParcel._id,
                              riderId: rider._id
                            })
                          }
                          disabled={assignMutation.isPending}>
                          {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
