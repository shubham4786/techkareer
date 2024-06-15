"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import logo from "@/assets/logo.webp";
import { toast } from "react-toastify";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSignupSchema } from "@/schema/form-schema";
import { Loader } from "lucide-react";
import Image from "next/image";

function LoginBox() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSignupSchema>>({
    resolver: zodResolver(loginSignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSignupSchema>) {
    try {
      setLoading(true);

      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInData?.error) {
<<<<<<< HEAD
=======
        console.log(signInData.error);
>>>>>>> ee4a21e91cd212856df35dcb159b78b9f12c8d52
        throw new Error("Incorrect Details");
      }
      toast.success("Onboarding Successful");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
<<<<<<< HEAD
      <div className="gap-[1rem] px-5 py-8 rounded-3xl bg-gray-900/30 flex flex-col items-center  max-w-[450px] h-[max-content] mt-4 ">
        <div className="mb-8">
          <p className="text-3xl">Welcome to TechKareer</p>
        </div>
        <div>
          <button
            className="flex justify-center items-center gap-3 mb-2 bg-gray-200 px-6 py-3 rounded-xl"
            onClick={() => {
              signIn("google");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>

            <span className="text-xl text-black/80 ">Login with Google</span>
          </button>
        </div>
        {/* <hr className="bg-white w-full h-[1px]" /> */}
        {/* <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg ">Email</FormLabel>
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
                    <Input
                      type="password"
                      {...field}
                      className="border-gray-700 text-lg border"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center items-center w-full">
              <Button
                type="submit"
                className="text-2xl bg-blue-600 text-white px-5 py-3 min-w-[200px]"
              >
                {loading ? <Loader className="animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
        </Form> */}
=======
      <div className="md:justify-left flex h-screen flex-col justify-center break-words border-0 border-solid border-white leading-6 text-white md:flex-row">
        <div
          className="login-left-side max-sm:hidden flex flex-1 flex-col break-words border-0 border-solid border-white bg-cover bg-no-repeat p-10 text-center md:flex-shrink md:text-left"
          style={{
            backgroundImage: `url(/login.png)`,
            backgroundPosition: "center center",
          }}
        >
          <div className="flex justify-center text-center md:mb-36 md:block md:text-left">
            <Link href="/">
              <div className="title-font mb-6 flex cursor-pointer items-center font-medium md:mb-0">
                <Image
                  className="cursor-pointer w-40"
                  src={logo}
                  alt="TechKareer"
                  onClick={() => router.push("/")}
                />
              </div>
            </Link>
          </div>
          <p className="mt-12 text-center text-4xl font-bold sm:text-6xl md:text-left md:font-extrabold lg:pr-10">
            Making <br />
            Hiring <br />
            Easier <br />
            Than <br />
            Ever.
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center border-0 border-solid border-white px-8 py-6 text-white md:px-20">
          <div className="flex flex-col items-center break-words border-0 border-solid border-white">
            <div className="w-128 flex flex-col items-center border-0 border-solid border-white">
              <div className="w-128 flex flex-col items-center border-0 border-solid border-white">
                <h2 className="text-center text-2xl font-bold sm:text-4xl md:font-extrabold">
                  {"Let's build something great!"}
                </h2>
              </div>
              <h2 className="mt-2 hidden max-w-lg p-0 text-center tracking-tight sm:mt-4 sm:text-lg md:block">
                Join our community to get access to cutting-edge tools and
                collaborate with like-minded developers
              </h2>
              <div className="my-4 w-full border-t border-white"></div>
            </div>

            <div>
              <center>
                <button
                  className="next-ui-gradient-btn mx-auto mb-3  w-9/12 rounded-xl"
                  color="gradient"
                  style={{ padding: "10px 24px" }}
                  onClick={() => signIn("google")}
                >
                  <GoogleIcon className="mr-4" />
                  Login with Google
                </button>

                <h5 className="text-center text-md mt-2 mb-5 text-gray-400 font-semibold">
                  or
                </h5>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-9/12"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Email"
                              className="border-gray-700 text-lg py-6"
                            />
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
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                              className="border-gray-700 py-6 text-lg border flex items-center"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center items-center w-full">
                      <button
                        type="submit"
                        className="text-xl flex items-center justify-center next-ui-gradient-btn bg-blue-600 text-white px-5 py-3 rounded-xl min-w-[170px]"
                      >
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>
                  </form>
                </Form>
              </center>
              <div className="mx-auto w-9/12 text-left">
                <div className="mt-4 border-0 border-solid border-white">
                  <p className="border-0 border-solid border-white text-left text-xs text-neutral-400">
                    By logging in, you acknowledge that you have read,
                    understood, and agree to our&nbsp;
                    <Link
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                      className="text-neutral-400"
                    >
                      Terms of Service
                    </Link>
                    &nbsp;and&nbsp;
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                      className="text-neutral-400"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
>>>>>>> ee4a21e91cd212856df35dcb159b78b9f12c8d52
      </div>
    </>
  );
}

export default LoginBox;
