'use client';
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "../utills/auth";

const AuthContext = createContext({
    user: null,
    loading: true
})


export const AuthProvider = ({children}:{children:React.ReactNode})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()


      useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res?.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{user, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=> useContext(AuthContext)