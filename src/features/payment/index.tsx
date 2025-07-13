import React, { useEffect, useState } from 'react';
import { loadPayPalScript } from '../../../integrations/paypal/config'; // Adjust path as needed
import { PayPalButtons } from '@paypal/react-paypal-js'; // Assuming @paypal/react-paypal-js is installed or will be
import axios from 'axios';

const PaymentFeature: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  useEffect(() => {
    // Load PayPal script when component mounts
    loadPayPalScript();
  }, []);

  const createOrder = async () => {
    try {
      // Call backend to create PayPal order
      const response = await axios.post('/api/payment/checkout', { amount: 10.00 }); // Example amount
      const { orderId } = response.data;
      setOrderId(orderId);
      return orderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      setPaymentStatus('Error creating order.');
      return null;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Call backend to capture payment
      const response = await axios.post(`/api/payment/process/${data.orderID}`, {
        payerId: data.payerID,
        paymentId: data.paymentID, // For older PayPal integrations, might not be needed for v2
        // Add any other necessary approval details
      });
      if (response.data.status === 'COMPLETED') {
        setPaymentStatus('Payment successful!');
        console.log('Payment captured:', response.data);
      } else {
        setPaymentStatus('Payment not completed.');
        console.log('Payment not completed:', response.data);
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      setPaymentStatus('Error capturing payment.');
    }
  };

  return (
    <div className="payment-feature">
      <h2>Complete Your Purchase</h2>
      {paymentStatus && <p>{paymentStatus}</p>}
      {orderId ? (
        <PayPalButtons
          createOrder={(data, actions) => createOrder()}
          onApprove={(data, actions) => onApprove(data, actions)}
        />
      ) : (
        <button onClick={createOrder}>Initiate PayPal Payment</button>
      )}
    </div>
  );
};

export default PaymentFeature;