// MakeAdmin.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const {
    data: users = [],
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['searchedUser', searchEmail],
    queryFn: async () => {
      if (!searchEmail.trim()) return [];
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      return res.data;
    },
    enabled: triggerSearch && !!searchEmail
  });

  const mutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/role/${id}`, { role });
      return res.data;
    },
    onSuccess: (_, variables) => {
      Swal.fire('Success', `User role changed to ${variables.role}`, 'success');
      queryClient.invalidateQueries(['searchedUser', searchEmail]);
    },
    onError: () => {
      Swal.fire('Error', 'Role update failed', 'error');
    }
  });

  const handleSearch = () => {
    if (!searchEmail.trim()) return;
    setTriggerSearch(true);
    refetch();
  };

  const handleRoleChange = (id, role) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${role === 'admin' ? 'make this user an admin' : 'remove admin role'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, role });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Make / Remove Admin</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Search user by email"
          className="input input-bordered w-full"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={isFetching}>
          {isFetching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Current Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>{user.role || 'user'}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <button className="btn btn-sm btn-warning" onClick={() => handleRoleChange(user._id, 'user')} disabled={mutation.isPending}>
                        Remove Admin
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => handleRoleChange(user._id, 'admin')} disabled={mutation.isPending}>
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
