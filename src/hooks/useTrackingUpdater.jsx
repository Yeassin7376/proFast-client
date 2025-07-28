// hooks/useTrackingUpdater.js
import { useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingUpdater = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const axiosSecure = useAxiosSecure();

  const addTrackingUpdate = async ({ tracking_id, status, description, location }) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await axiosSecure.post("/tracking", {
        tracking_id,
        status,
        description,
        location,
      });

      setSuccessMessage("Tracking updated successfully");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update tracking");
    } finally {
      setLoading(false);
    }
  };

  return {
    addTrackingUpdate,
    loading,
    error,
    successMessage,
  };
};

export default useTrackingUpdater;
