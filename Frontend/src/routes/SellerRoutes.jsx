import { Route } from "react-router-dom";

import SellerRoute from "../components/SellerRoute";

import Dashboard from "../pages/seller/Dashboard";
import MyBooks from "../pages/seller/MyBooks";
import AddBook from "../pages/seller/AddBook";
import EditBook from "../pages/seller/EditBook";
import SellerOrders from "../pages/seller/SellerOrders";

export const sellerRoutes = () => (
  <>
    <Route
      path="/seller/dashboard"
      element={
        <SellerRoute>
          <Dashboard />
        </SellerRoute>
      }
    />

    <Route
      path="/seller/books"
      element={
        <SellerRoute>
          <MyBooks />
        </SellerRoute>
      }
    />

    <Route
      path="/seller/books/add"
      element={
        <SellerRoute>
          <AddBook />
        </SellerRoute>
      }
    />

    <Route
      path="/seller/books/edit/:id"
      element={
        <SellerRoute>
          <EditBook />
        </SellerRoute>
      }
    />

    <Route
      path="/seller/orders"
      element={
        <SellerRoute>
          <SellerOrders />
        </SellerRoute>
      }
    />
  </>
);