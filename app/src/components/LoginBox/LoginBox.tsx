"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function LoginBox() {
  const [userType, setUserType] = useState<"Jobseeker" | "Organization">(
    "Jobseeker"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required")
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the state based on the login type

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);

    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      type: userType,
      redirect: false,
    });
    if (signInData?.error) {
      toast.error("Incorrect Details");
      setLoading(false);
    } else {
      toast.success("Login Successful!");
      setPassword("");
      setEmail("");

      router.push(
        userType == "Organization"
          ? "/profile/organization"
          : "/profile/jobseeker"
      );
      setLoading(false);
    }
  }



  return (
    <>
      <div
        className="gap-[1rem] px-5 py-8 rounded-3xl bg-gray-900/30 flex flex-col items-center  max-w-[600px] h-[max-content] mt-4 "
      >
        <div className="mb-8">
          <h1 className="text-6xl mb-8 text-blue-500">Login</h1>
          <p className="text-xl text-gray-300">
            Welcome to techkareer, Please fill the details below to login !
          </p>
        </div>
        <Tabs
          defaultValue="Jobseeker"
          className="w-full flex justify-center item-center flex-col "
        >
          <div className="w-full flex justify-center items-center ">
            <TabsList className="w-fit p-5 mb-5">
              <TabsTrigger value="Jobseeker" onClick={()=> setUserType('Jobseeker')}className="text-xl">
                Jobseeker
              </TabsTrigger>
              <TabsTrigger value="Organization" onClick={()=> setUserType('Organization' )} className="text-xl">
                Organization
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="Jobseeker">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg ">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-700 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg ">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="border-gray-700 text-lg" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center w-full">
                  <Button
                    type="submit"
                    className="text-2xl bg-blue-600 text-white px-5 py-3 rounded-2xl"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="Organization">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg ">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-700 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg ">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-700 text-lg" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center w-full">
                  <Button
                    type="submit"
                    className="text-2xl bg-blue-600 text-white px-5 py-3 rounded-2xl"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>


        <div
          onClick={() => {
            if (userType == "Jobseeker") {
              router.push("/signup/jobseeker");
            } else if (userType == "Organization") {
              router.push("/signup/company");
            }
          }}
          className="signin-head text-lg mb-2 cursor-pointer hover:text-blue-500"
        >
          {userType == "Jobseeker"
            ? "Don't have a user account? Join Now"
            : "Hey! Join as an Organization!  "}
        </div>
      </div>
    </>
  );
}

export default LoginBox;

{
  /* <input
type="text"
name="email"
placeholder="Email"
value={email}
onChange={handleInputChange}
className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
/>
<input
type="password"
name="password"
placeholder="Password"
value={password}
onChange={handleInputChange}
className="w-full text-[13px] h-10 border-[2px] p-2 rounded"
/>

<div className="login-btn-wrapper ">
{loading ? (
  <Loader size="20px"></Loader>
) : (
  <button
    type="submit"
    className="submit-btn rounded-full px-3 py-1 text-[14px] text-[white] hover:bg-green-600 bg-green-500  "
  >
    Login
  </button>
)}
</div> */
}

{
  /* <div className="slider-login flex justify-between w-full">
<div
  className={`header-user w-[50%] flex justify-center cursor-pointer ${
    userType == "Jobseeker" ? "" : "hover:text-[#13883e]"
  }`}
  onClick={() => setUserType("Jobseeker")}
  style={
    userType == "Jobseeker" ? { borderBottom: "3px solid black" } : {}
  }
>
  Jobseeker
</div>
<div
  className={`header-org w-[50%] flex justify-center cursor-pointer ${
    userType == "Organization" ? "hover:text-[#13883e]" : ""
  }`}
  onClick={() => setUserType("Organization")}
  style={
    userType == "Organization"
      ? { borderBottom: "3px solid black" }
      : {}
  }
>
  Organization
</div>
</div> */
}
