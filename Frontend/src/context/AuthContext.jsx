import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await API.get("/auth/me");

      setUser(data.user);
    } catch {
      if (error.response?.status !== 401) {
            console.log(error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({email, phone, password}) => {
    const { data } = await API.post("/auth/login", {
      email,
      phone,
      password,
    });

    setUser(data.user);

    return data.user;
  };

  const register = async ({fullname, phone, email, password, gender, role}) => {
      const {data} = await API.post("/auth/register", {
        fullname,
        phone,
        email,
        password,
        gender,
        role
      });

      console.log(data.user);
      setUser(data.user);

      return data.user;
   }

   const logout = async () => {

    try {

      await API.get("/auth/logout");

      setUser(null);

      window.location.replace("/");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
