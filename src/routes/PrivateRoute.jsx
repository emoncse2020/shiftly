import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import { PropagateLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PropagateLoader />;
  }
  if (!user) {
    return (
      <Navigate to={"/login"} state={{ from: location.pathname }}></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
