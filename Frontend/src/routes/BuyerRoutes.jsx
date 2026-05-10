import { Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import Cart from "../pages/buyer/Cart";
import Checkout from "../pages/buyer/Checkout";
import Payment from "../pages/buyer/Payment";
import MyOrders from "../pages/buyer/MyOrders";

export const buyerRoutes = () => (
  <>
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />

    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />

    <Route
      path="/payment/:orderId"
      element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      }
    />

    <Route
      path="/my-orders"
      element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      }
    />
  </>
);