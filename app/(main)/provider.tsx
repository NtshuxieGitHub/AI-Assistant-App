"use client";
import React, { useContext, useEffect } from "react";
import Header from "./_components/Header";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const convex = useConvex();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    CheckUserAuth();
  });

  // Check user authentication
  const CheckUserAuth = async () => {
    // Get new access token
    const token = localStorage.getItem("user_token");
    const user = token && (await GetAuthUserData(token));
    if (!user?.email) {
      router.replace("/sign-in");
      return;
    }

    // Get user info from database
    try {
      const output = await convex.query(api.users.getUser, {
        email: user?.email,
      });
      setUser(output);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default Provider;
