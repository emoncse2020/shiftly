import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Load pending riders
  const {
    data: riders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // ✅ Handle Approve / Reject
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: newStatus });
      toast.success(
        `Rider ${newStatus === "active" ? "approved" : "rejected"} successfully`
      );
      refetch();
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to update rider status");
      console.error(err);
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading pending riders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Riders</h2>

      {/* Riders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">Rider Type</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{rider.fullName}</td>
                <td className="p-3">{rider.email}</td>
                <td className="p-3">{rider.contact}</td>
                <td className="p-3">{rider.region}</td>
                <td className="p-3 capitalize">{rider.riderType}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedRider(rider);
                      setIsOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100 transition"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modal */}
      {isOpen && selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-3 border-b pb-2">
              Rider Details
            </h3>

            <div className="space-y-2">
              <p>
                <strong>Full Name:</strong> {selectedRider.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRider.contact}
              </p>
              <p>
                <strong>Gender:</strong> {selectedRider.gender}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Rider Type:</strong> {selectedRider.riderType}
              </p>
              <p>
                <strong>NID No:</strong> {selectedRider.nidNo}
              </p>
              <p>
                <strong>License No:</strong> {selectedRider.licenseNo}
              </p>
              <p>
                <strong>Address:</strong> {selectedRider.address}
              </p>
              <p>
                <strong>Covered Area:</strong>{" "}
                {selectedRider.coveredArea?.join(", ")}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() =>
                  handleStatusChange(selectedRider._id, "rejected")
                }
                className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                onClick={() => handleStatusChange(selectedRider._id, "active")}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <CheckCircle size={18} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
