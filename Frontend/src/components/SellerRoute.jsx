import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box} from "@mui/material";


export default function SellerRoute({children}) {

  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }


  if (user.role !== "seller") {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}