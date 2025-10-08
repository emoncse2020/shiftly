import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={1000} />
    </Elements>
  );
};

export default Payment;
