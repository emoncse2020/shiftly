import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null); // Parcel for modal
  const [actionType, setActionType] = useState(""); // "pickup" or "deliver"

  // Fetch rider parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderParcels"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // Mutation to update parcel status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(`✅ Parcel status updated successfully!`);
      setSelectedParcel(null);
      setActionType("");
      queryClient.invalidateQueries({ queryKey: ["riderParcels"] });
    },
    onError: () => {
      toast.error("❌ Failed to update parcel status");
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">Loading parcels...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 text-center md:text-left">
        Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No pending deliveries.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Parcel Name</th>
                <th className="p-3">Sender</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {parcel.tracking_id}
                  </td>
                  <td className="p-3">{parcel.parcelName}</td>
                  <td className="p-3">{parcel.senderName}</td>
                  <td className="p-3">{parcel.receiverName}</td>
                  <td className="p-3 font-semibold text-gray-700">
                    {parcel.delivery_status}
                  </td>
                  <td className="p-3 text-center">
                    {parcel.delivery_status === "rider-assigned" && (
                      <button
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setActionType("pickup");
                        }}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in-transit" && (
                      <button
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setActionType("deliver");
                        }}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Confirmation */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <h3 className="text-lg font-semibold">
                Confirm {actionType === "pickup" ? "Pickup" : "Delivery"}
              </h3>
              <p className="text-sm mt-1">
                Are you sure you want to mark this parcel as{" "}
                <span className="font-semibold">
                  {actionType === "pickup" ? "Picked Up" : "Delivered"}
                </span>
                ?
              </p>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <p>
                  <strong>Tracking ID:</strong> {selectedParcel.tracking_id}
                </p>
                <p>
                  <strong>Parcel Name:</strong> {selectedParcel.parcelName}
                </p>
                <p>
                  <strong>Sender:</strong> {selectedParcel.senderName}
                </p>
                <p>
                  <strong>Receiver:</strong> {selectedParcel.receiverName}
                </p>
                <p>
                  <strong>Pickup Instruction:</strong>{" "}
                  {selectedParcel.pickupInstruction}
                </p>
                <p>
                  <strong>Delivery Instruction:</strong>{" "}
                  {selectedParcel.deliveryInstruction}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const newStatus =
                      actionType === "pickup" ? "in-transit" : "delivered";
                    updateStatusMutation.mutate({
                      parcelId: selectedParcel._id,
                      status: newStatus,
                    });
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSelectedParcel(null);
                    setActionType("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
