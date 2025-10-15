import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();
  const [trackingId, setTrackingId] = useState("");
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingId) {
      Swal.fire("Error", "Please enter a tracking ID", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.get(`/trackings/${trackingId}`);

      const updates = res.data || [];

      if (updates.length === 0) {
        Swal.fire("Not Found", "No updates found for this tracking ID", "info");
        setLatestUpdate(null);
        return;
      }

      // Sort updates by timestamp descending and pick the latest
      const latest = updates.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )[0];

      setLatestUpdate(latest);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch tracking updates", "error");
      setLatestUpdate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Track Your Parcel
      </h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />
        <button
          onClick={handleTrack}
          className="btn bg-blue-500 hover:bg-blue-600 text-white px-4"
        >
          Track
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading update...</p>}

      {latestUpdate && (
        <div className="mt-6 border p-4 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">
            Latest Tracking Update:
          </h3>
          <p>
            <strong>Status:</strong> {latestUpdate.status}
          </p>
          {latestUpdate.details && (
            <p>
              <strong>Details:</strong> {latestUpdate.details}
            </p>
          )}
          {latestUpdate.location && (
            <p>
              <strong>Location:</strong> {latestUpdate.location}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(latestUpdate.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
