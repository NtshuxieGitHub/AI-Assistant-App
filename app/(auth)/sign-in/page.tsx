"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function SignIn() {
  const createUser = useMutation(api.users.createUser);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Get date and time of sign in
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      if (typeof window !== undefined) {
        localStorage.setItem("user_token", tokenResponse.access_token);
      }

      const userInfo = await GetAuthUserData(tokenResponse.access_token);

      // Save user info to database
      const output = await createUser({
        given_name: userInfo?.given_name,
        family_name: userInfo?.family_name,
        email: userInfo?.email,
        picture: userInfo.picture,
        date: formattedDate,
        time: formattedTime,
      });

      setUser(output);
      router.replace("/ai-assistants");
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className="flex items-center flex-col justify-center h-screen ">
      <div className="flex flex-col items-center gap-8 border rounded-2xl px-40 py-10 shadow-md">
        <Image src={"/logo.svg"} width={100} height={200} alt="logo" />
        <h2 className="text-2xl">Sign In to AIssistant</h2>
        <Button
          className="bg-orange-300 text-black font-bold"
          onClick={() => googleLogin()}
        >
          Sign In with Gmail
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
