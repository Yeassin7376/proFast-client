import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';


const formatDateTime = (iso) => {
    if (!iso) return "N/A";
    const date = new Date(iso);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  

const PaymentHistory = () => {
  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payments', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    }
  });

  if (isPending) {
    return '...loading';
  }

  return (
    <div className="overflow-x-auto border border-base-300 rounded-lg">
      <table className="table w-full">
        <thead className="bg-base-200 text-sm">
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Parcel ID</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment.transactionId}>
              <td>{index + 1}</td>
              <td className="font-mono text-sm text-primary">{payment.transactionId}</td>
              <td>${payment.amount}</td>
              <td className="capitalize">{payment.method?.[0] || '—'}</td>
              <td>
                <div className="tooltip" data-tip={payment.parcel_id}>
                  <span className="text-xs text-gray-600">{payment.parcel_id}</span>
                </div>
              </td>
              <td>{formatDateTime(payment.paid_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {payments.length === 0 && <div className="text-center py-8 text-gray-500">No payment history found.</div>}
    </div>
  );
};

export default PaymentHistory;
