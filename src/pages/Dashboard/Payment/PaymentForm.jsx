import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import "animate.css";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const { isPending, data: parcelInfo } = useQuery({
    queryKey: ['parcel', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcel/${parcelId}`);
      return res.data;
    }
  });

  if (isPending) {
    return <p>loading....</p>;
  }

  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card
    });

    if (error) {
      setError(error.message);
      console.log('[error]', error);
    } else {
      setError('');
      console.log('[PaymentMethod]', paymentMethod);

      // step-2 create payment intent
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        parcelId
      });
      const clientSecret = res.data.clientSecret;

      // Confirm the payment with the card element
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setError('');
          console.log('Payment Succeeded!');
          console.log(result);
          const transactionId = result.paymentIntent.id
          //   mark parcel paid also save payment history
          // expected: { amount, method, paid_by, transactionId }
          const paymentData = {
            parcel_id: parcelId,
            amount,
            method: result.paymentIntent.payment_method_types,
            paid_id: user.email,
            transactionId: transactionId
          };

          const paymentRes = await axiosSecure.post('/payments', paymentData);

          if (paymentRes.data.insertedId) {
            Swal.fire({
              title: '🎉 Payment Successful!',
              html: `
                  <p>Your payment was completed successfully.</p>
                  <p class="mt-2"><strong>Transaction ID:</strong></p>
                  <div class="text-lg font-mono font-bold bg-base-200 p-2 rounded mt-1">
                    ${transactionId}
                  </div>
                `,
              icon: 'success',
              confirmButtonText: 'Go to My Parcels',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            }).then(() => {
              navigate('/dashboard/myParcels');
            });
          }
        }
      }
      //   console.log('res from intent', res);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-base-200 p-6 rounded-xl shadow-md space-y-4">
        <CardElement className="p-2 bg-white rounded shadow-sm"></CardElement>
        <button type="submit" className="btn btn-primary text-black w-full" disabled={!stripe}>
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
