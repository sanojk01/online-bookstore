import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Buyer
import Home from "../pages/buyer/Home";
import BooksPage from "../pages/buyer/BooksPage";
import BookDetail from "../pages/buyer/BookDetail";

// Route groups
import { buyerRoutes } from "./BuyerRoutes";
import { sellerRoutes } from "./SellerRoutes";

export default function AppRoutes() {

  return (
    <>
      <Navbar />

      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/books"
          element={<BooksPage />}
        />

        <Route
          path="/books/:id"
          element={<BookDetail />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Buyer */}
        {buyerRoutes()}

        {/* Seller */}
        {sellerRoutes()}

      </Routes>
    </>
  );
}