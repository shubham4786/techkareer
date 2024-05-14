'use client'
import { WithoutAuth } from "@/components/HOC/withOutAuth";
import { BottomBar, LoginBox,  } from "@/components/components";
import { Navbar } from "@/components/Navbar";
import React from "react";

function LoginPage() {
  return (
    <>
      <Navbar/>
      <div className="flex min-h-fit justify-center items-center mt-24">
        <LoginBox/>
      </div>
      <BottomBar></BottomBar>

    </>
  );
}

export default WithoutAuth( LoginPage);
