import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
        <CartProvider>
            <ToastContainer position="top-right" autoClose={3000}/>
            <AppRoutes />
        </CartProvider>
    </AuthProvider>
  )
}

export default App