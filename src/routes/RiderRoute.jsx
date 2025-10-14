import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useUserRole();
  if (loading || isLoading) {
    return <PropagateLoader />;
  }

  if (!user || role !== "rider") {
    return (
      <Navigate
        to={"/forbidden"}
        state={{ from: location.pathname }}
      ></Navigate>
    );
  }
  return children;
};

export default RiderRoute;
