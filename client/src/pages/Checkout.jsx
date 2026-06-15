import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { itemsInCart, itemsTotalPrice } from "../redux/handleCart/CartSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#e53e3e',
      iconColor: '#e53e3e',
    },
  },
};

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const total = useSelector(itemsTotalPrice);
  const items = useSelector(itemsInCart);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent on backend (amount in cents)
      const res = await axios.post(
        `${SERVER_URL}/api/payment/stripe/create-payment-intent`,
        { amount: Math.round(total * 100) }
      );

      const { clientSecret } = res.data;

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5ef]">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for your order.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-36 flex items-center justify-center bg-[#f5f5ef]">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">Checkout</h2>
        <p className="text-gray-600 mb-6">Total: <span className="font-bold">RM{total.toFixed(2)}</span></p>

        {/* Order summary */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Summary</h3>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm py-1">
              <span>{item.name} x{item.quantity}</span>
              <span>RM{item.accPrice?.toFixed(2) ?? (item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Payment form */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-3 mb-4">
            <CardElement options={cardElementOptions} />
          </div>

          {paymentError && (
            <p className="text-red-500 text-sm mb-4">{paymentError}</p>
          )}

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay RM${total.toFixed(2)}`}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-2 text-gray-600 text-sm hover:underline"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}

export default Checkout;