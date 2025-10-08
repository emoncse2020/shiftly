import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FiCreditCard, FiLoader } from "react-icons/fi";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/?email=${user.email}`);
      return res.data;
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FiLoader className="animate-spin text-4xl mb-3" />
        <p>Loading payment history...</p>
      </div>
    );
  }

  // Empty state
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <FiCreditCard className="text-5xl mb-3 text-gray-400" />
        <p>No payment history found.</p>
      </div>
    );
  }

  // Sort payments by latest first
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paid_at) - new Date(a.paid_at)
  );

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Payment History
          </h2>
          <p className="text-sm text-gray-500">
            All your payment transactions are listed here.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Parcel ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Payment Methods
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Paid At
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment, idx) => (
                <tr
                  key={payment._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {payment.parcelId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {payment.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${payment.amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {payment.paymentMethod.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {payment.transactionId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(payment.paid_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
