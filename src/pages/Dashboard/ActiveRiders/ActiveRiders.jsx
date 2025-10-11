import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiUser, FiPhone, FiMapPin, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch all active riders
  const {
    data: riders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // Client-side search filtering
  const filteredRiders = riders.filter((rider) =>
    rider.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Deactivate rider
  const handleDeactivate = async (id) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "inactive" });
      toast.success("Rider deactivated successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate rider");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center w-full sm:w-1/3 bg-base-200 rounded-lg px-3 py-2">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            className="input input-ghost w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table container for responsiveness */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full min-w-[600px] lg:min-w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="hidden sm:table-cell">Age</th>
              <th>Contact</th>
              <th className="hidden md:table-cell">Region</th>
              <th className="hidden md:table-cell">District</th>
              <th className="hidden lg:table-cell">Rider Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No active riders found.
                </td>
              </tr>
            ) : (
              filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <th>{index + 1}</th>
                  <td className="flex items-center gap-2">
                    <FiUser /> {rider.fullName}
                  </td>
                  <td className="hidden sm:table-cell">{rider.age}</td>
                  <td className="flex items-center gap-2">
                    <FiPhone /> {rider.contact}
                  </td>
                  <td className="hidden md:table-cell flex items-center gap-2">
                    <FiMapPin /> {rider.region}
                  </td>
                  <td className="hidden md:table-cell">{rider.district}</td>
                  <td className="hidden lg:table-cell">{rider.riderType}</td>
                  <td>
                    <span className="badge badge-success">{rider.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm btn-warning"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
