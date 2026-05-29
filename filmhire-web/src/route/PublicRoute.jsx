import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectSession,
  selectLoading,
} from "../store/slice/authSlice";

function PublicRoute({ children }) {
  const session = useSelector(selectSession);
  const loading = useSelector(selectLoading);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;