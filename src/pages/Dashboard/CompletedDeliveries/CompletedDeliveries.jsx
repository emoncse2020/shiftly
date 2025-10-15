import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // ✅ Fetch completed parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedParcels"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/completedParcels?email=${user.email}`
      );
      return res.data;
    },
  });

  // ✅ Cashout mutation
  const cashoutMutation = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/riders/cashout/${parcelId}`);
      return res.data;
    },
    onSuccess: () => {
      setSelectedParcel(null);
      queryClient.invalidateQueries({ queryKey: ["completedParcels"] });
    },
  });

  // ✅ Calculate totals
  const { totalEarned, totalCashedOut, totalPending } = useMemo(() => {
    let totalEarned = 0;
    let totalCashedOut = 0;

    parcels.forEach((p) => {
      const cost = Number(p.cost?.$numberInt || p.cost || 0);
      const earning =
        p.senderDistrict === p.receiverDistrict ? cost * 0.7 : cost * 0.3;
      totalEarned += earning;
      if (p.is_cashout) totalCashedOut += earning;
    });

    return {
      totalEarned,
      totalCashedOut,
      totalPending: totalEarned - totalCashedOut,
    };
  }, [parcels]);

  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Completed Deliveries
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-center">
          <h3 className="text-sm font-semibold uppercase">Total Earned</h3>
          <p className="text-2xl font-bold mt-1">৳{totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center">
          <h3 className="text-sm font-semibold uppercase">Cashed Out</h3>
          <p className="text-2xl font-bold mt-1">
            ৳{totalCashedOut.toFixed(2)}
          </p>
        </div>
        <div className="bg-amber-100 text-amber-800 p-4 rounded-xl text-center">
          <h3 className="text-sm font-semibold uppercase">Pending</h3>
          <p className="text-2xl font-bold mt-1">৳{totalPending.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Tracking ID</th>
              <th className="px-4 py-3">Parcel</th>
              <th className="px-4 py-3">Sender</th>
              <th className="px-4 py-3">Receiver</th>
              <th className="px-4 py-3">Earning</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => {
              const cost = Number(parcel.cost?.$numberInt || parcel.cost || 0);
              const earning =
                parcel.senderDistrict === parcel.receiverDistrict
                  ? cost * 0.7
                  : cost * 0.3;

              return (
                <tr
                  key={parcel._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    {parcel.tracking_id}
                  </td>
                  <td className="px-4 py-3">{parcel.parcelName}</td>
                  <td className="px-4 py-3">{parcel.senderName}</td>
                  <td className="px-4 py-3">{parcel.receiverName}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    ৳{earning.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {parcel.is_cashout ? (
                      <span className="text-sm text-green-700 font-semibold">
                        Cashed Out
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedParcel({ ...parcel, earning })
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs"
                      >
                        Cashout
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <p className="text-center text-gray-600 py-6">
            No completed deliveries found.
          </p>
        )}
      </div>

      {/* ✅ Confirmation Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[400px]">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Cashout
            </h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to cash out this parcel?
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p>
                <strong>Parcel:</strong> {selectedParcel.parcelName}
              </p>
              <p>
                <strong>Tracking ID:</strong> {selectedParcel.tracking_id}
              </p>
              <p>
                <strong>Earning:</strong> ৳{selectedParcel.earning.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedParcel(null)}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  cashoutMutation.mutate(selectedParcel._id, {
                    onSuccess: () => setSelectedParcel(null),
                  })
                }
                disabled={cashoutMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
              >
                {cashoutMutation.isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
