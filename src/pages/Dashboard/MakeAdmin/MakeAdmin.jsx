import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // --- Search users query ---
  const {
    data: users = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", searchTerm],
    queryFn: async () => {
      if (!axiosSecure || !searchTerm) return [];
      const res = await axiosSecure.get(`/users/search?email=${searchTerm}`);
      return res.data;
    },
    enabled: !!searchTerm && !!axiosSecure,
    keepPreviousData: true,
  });

  // --- Mutation to update user role ---
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);
      // Optimistically update user role in cache
      queryClient.setQueryData(["searchUsers", searchTerm], (old = []) =>
        old.map((user) =>
          user._id === variables.id ? { ...user, role: variables.role } : user
        )
      );
    },
    onError: () => toast.error("Failed to update role"),
  });

  const handleSearch = () => {
    if (!searchEmail.trim()) return toast.error("Enter email to search");
    setSearchTerm(searchEmail.trim());
    refetch(); // triggers queryFn
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Make Admin</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      <div>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 text-center">
                    {new Date(user.created_at).toDateString()}
                  </td>
                  <td className="border p-2 text-center">
                    {user.role || "user"}
                  </td>
                  <td className="border p-2 flex gap-2">
                    {user.role !== "admin" && (
                      <button
                        onClick={() =>
                          updateRoleMutation.mutate({
                            id: user._id,
                            role: "admin",
                          })
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role === "admin" && (
                      <button
                        onClick={() =>
                          updateRoleMutation.mutate({
                            id: user._id,
                            role: "user",
                          })
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
