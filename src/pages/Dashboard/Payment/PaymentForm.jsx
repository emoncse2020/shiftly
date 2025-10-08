import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch parcel info
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">
        Loading payment details...
      </p>
    );
  }

  const amount = parcelInfo?.cost || 0;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setLoading(true);
    setError("");
    // setSuccess(false);

    // Create payment method
    const { error: methodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: user?.displayName || "Anonymous",
          email: user?.email,
        },
      });

    if (methodError) {
      setError(methodError.message);
      setLoading(false);
      return;
    }

    try {
      // Create payment intent from server
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: amountInCents,
        parcelId,
      });

      const clientSecret = data.clientSecret;

      // Confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        const paymentData = {
          parcelId,
          email: user.email,
          amount,
          transactionId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types,
        };
        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.insertedId) {
          //   setSuccess(true);
          //   console.log("Payment successful!", paymentIntent)
          Swal.fire({
            title: "Payment Successful!",
            text: "Thank you for your payment. Your parcel will be processed soon.",
            icon: "success",
            confirmButtonColor: "#3B82F6",
            confirmButtonText: "Go to My Parcels",
          }).then(() => {
            navigate("/dashboard/myParcels");
          });

          // ;
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex justify-center items-center bg-base-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Secure Billing & Payment
        </h2>

        {/* Billing Summary */}
        <div className="mb-6 border rounded-2xl p-4 bg-gray-50 space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">
            Billing Details
          </h3>
          <p>
            <span className="font-medium text-gray-600">Customer Name:</span>{" "}
            {user?.displayName || "Guest User"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            {user?.email || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Parcel ID:</span>{" "}
            {parcelId}
          </p>
          <p>
            <span className="font-medium text-gray-600">Receiver Name:</span>{" "}
            {parcelInfo?.receiverName || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Receiver Phone:</span>{" "}
            {parcelInfo?.receiverContactNo || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Delivery Address:</span>{" "}
            {parcelInfo?.receiverAddress || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Weight:</span>{" "}
            {parcelInfo?.parcelWeight || "N/A"} kg
          </p>
          <p>
            <span className="font-medium text-gray-600">Payment Amount:</span>
            <span className="text-green-600 font-semibold ml-1">
              ${amount.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border p-3 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className={`btn btn-primary w-full font-medium ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing Payment..." : `Pay $${amount}`}
          </button>

          {error && <p className="text-error text-sm text-center">{error}</p>}
          {/* {success && (
            <p className="text-green-600 text-center font-medium">
              ✅ Payment successful! Thank you,{" "}
              {user?.displayName || "Customer"}.
            </p>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
