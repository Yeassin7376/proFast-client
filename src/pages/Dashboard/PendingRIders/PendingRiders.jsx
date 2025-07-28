import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: pendingRiders = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['pendingRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders?status=pending');
      return res.data;
    }
  });

  const handleDecision = async (id, status, email) => {
    try {
      const res = await axiosSecure.patch(`/riders/${id}`, { status, email });
      if (res.data.modifiedCount > 0) {
        Swal.fire('Success', `Rider ${status} successfully`, 'success');
        setSelectedRider(null);
        await refetch(); // re-fetch using useQuery only
      }
    } catch {
      Swal.fire('Error', 'Failed to update rider status', 'error');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th>Applied On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.age}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.phone}</td>
                <td>{formatDate(rider.application_date)}</td>
                <td>
                  <button className="btn btn-sm btn-info" onClick={() => setSelectedRider(rider)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="text-center mt-4">Loading...</p>}
      </div>

      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Rider Details</h3>
            <p>
              <strong>Name:</strong> {selectedRider.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRider.email}
            </p>
            <p>
              <strong>Age:</strong> {selectedRider.age}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRider.phone}
            </p>
            <p>
              <strong>NID:</strong> {selectedRider.nid}
            </p>
            <p>
              <strong>Bike Brand:</strong> {selectedRider.bike_brand}
            </p>
            <p>
              <strong>Registration:</strong> {selectedRider.bike_registration}
            </p>
            <p>
              <strong>Region:</strong> {selectedRider.region}
            </p>
            <p>
              <strong>District:</strong> {selectedRider.district}
            </p>
            <p>
              <strong>Applied On:</strong> {formatDate(selectedRider.application_date)}
            </p>
            <div className="modal-action">
              <button className="btn btn-success" onClick={() => handleDecision(selectedRider._id, 'active', selectedRider.email)}>
                Accept
              </button>
              <button className="btn btn-error" onClick={() => handleDecision(selectedRider._id, 'cancelled', selectedRider.email)}>
                Reject
              </button>
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
