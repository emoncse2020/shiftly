import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  // ✅ Load parcels that are paid but not yet collected
  const { data: parcels = [], isLoading: loadingParcels } = useQuery({
    queryKey: ["paidNotCollectedParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data;
    },
  });

  // ✅ Mutation: Assign rider + update statuses + log tracking
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcel, rider }) => {
      // 1️⃣ Update parcel delivery status & assign rider
      await axiosSecure.patch(`/parcels/${parcel._id}/assignRider`, {
        riderId: rider._id,
        riderEmail: rider.email,
        delivery_status: "Out for Delivery",
      });

      // 2️⃣ Update rider status
      await axiosSecure.patch(`/riders/${rider._id}/work-status`, {
        work_status: "in-delivery",
      });

      // 3️⃣ Log tracking update
      await axiosSecure.post("/trackings", {
        tracking_id: parcel.tracking_id,
        status: "Out for Delivery",
        details: `Rider ${rider.fullName} assigned for delivery.`,
        location: rider.district,
        updated_by: "admin", // or current logged-in user
      });
    },
    onSuccess: () => {
      toast.success("✅ Rider assigned and tracking updated!");
      setSelectedParcel(null);
      queryClient.invalidateQueries({ queryKey: ["paidNotCollectedParcels"] });
    },
    onError: () => toast.error("❌ Failed to assign rider or update tracking"),
  });

  // ✅ Load available riders by district
  const loadRiders = async (district) => {
    try {
      setLoadingRiders(true);
      const res = await axiosSecure.get(
        `/riders/available?district=${district}`
      );
      setRiders(res.data);
    } catch (error) {
      toast.error("Failed to load riders");
    } finally {
      setLoadingRiders(false);
    }
  };

  if (loadingParcels)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">Loading parcels...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 text-center md:text-left">
        Assign Rider
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No parcels available for assignment.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Parcel Name</th>
                <th className="p-3">Sender District</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Cost</th>
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
                  <td className="p-3">{parcel.senderDistrict}</td>
                  <td className="p-3">{parcel.receiverName}</td>
                  <td className="p-3 font-semibold text-gray-700">
                    ৳{parcel.cost}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedParcel(parcel);
                        loadRiders(parcel.senderDistrict);
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Selection Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <h3 className="text-lg font-semibold">
                Assign Rider for{" "}
                <span className="text-yellow-300">
                  {selectedParcel.tracking_id}
                </span>
              </h3>
              <p className="text-sm text-gray-100 mt-1">
                District: {selectedParcel.senderDistrict}
              </p>
            </div>

            <div className="p-5">
              {loadingRiders ? (
                <p className="text-gray-500 text-center py-6">
                  Loading available riders...
                </p>
              ) : riders.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No riders found in{" "}
                  <span className="font-semibold">
                    {selectedParcel.senderDistrict}
                  </span>
                  .
                </p>
              ) : (
                <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {riders.map((rider) => (
                    <li
                      key={rider._id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {rider.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{rider.email}</p>
                        <p className="text-xs text-gray-400">
                          {rider.riderType} • {rider.district}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          assignRiderMutation.mutate({
                            parcel: selectedParcel,
                            rider,
                          })
                        }
                        className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                      >
                        Assign
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setSelectedParcel(null)}
                className="mt-5 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
