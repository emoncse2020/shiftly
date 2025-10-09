import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch parcels for current user
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);

      return res.data;
    },
  });

  const handleViewDetails = (parcel) => {};

  const handlePay = async (parcel) => {
    navigate(`/dashboard/payment/${parcel._id}`);
  };

  const handleDelete = async (parcel) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete parcel ${parcel.tracking_id}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/parcels/${parcel._id}`);

        // Backend returns { deletedCount: 1 } if successful
        if (res.data.deletedCount) {
          await Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `Parcel ${parcel.tracking_id} has been deleted successfully.`,
            timer: 1800,
            showConfirmButton: false,
          });
          refetch();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Parcel not found or already deleted.",
          });
        }
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Could not delete parcel. Please try again.",
      });
    }
  };

  if (isLoading) return <p>Loading parcels...</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">My Parcels</h1>

      {parcels.map((parcel, index) => (
        <div
          key={parcel._id}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100"
        >
          {/* Left Info */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-400 font-semibold">#{index + 1}</p>
            <p className="font-bold text-gray-800 text-lg">
              {parcel.tracking_id} — {parcel.parcelType}
            </p>
            <p className="text-gray-500 text-sm">
              {parcel.senderDistrict} → {parcel.receiverDistrict}
            </p>
            <p className="text-gray-600 text-sm">
              Weight: {parcel.parcelWeight} kg
            </p>
            <p className="text-gray-600 text-sm">
              Cost: <span className="font-semibold">৳{parcel.cost}</span>
            </p>
            <p className="text-gray-500 text-xs">
              Created: {dayjs(parcel.created_at).format("DD/MM/YYYY hh:mm A")}
            </p>
          </div>

          {/* Right Status & Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                parcel.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {parcel.payment_status.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                parcel.delivery_status === "delivered"
                  ? "bg-green-500"
                  : parcel.delivery_status === "in_transit"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              {parcel.delivery_status.replaceAll("_", " ").toUpperCase()}
            </span>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleViewDetails(parcel)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
              >
                View
              </button>
              {parcel.payment_status === "unpaid" && (
                <button
                  onClick={() => handlePay(parcel)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Pay
                </button>
              )}
              <button
                onClick={() => handleDelete(parcel)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyParcels;
