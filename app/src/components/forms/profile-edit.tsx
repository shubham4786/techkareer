"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/schema/form-schema";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/useUser";
import { Textarea } from "@/components/ui/textarea"

export function EditProfileForm({ userId }: {  userId: string }) {
  const [loading, setIsLoading] = React.useState(false);
  const [isNoInfoAvail, setIsNoInfoAvail] = React.useState(false);
  const { user } = useUserInfo(userId);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      twitterProfile: "",
      linkedInProfile: "",
      email:"",
        description:"",
        // roles:[],
        resume:"",
        github:"",
        portfolio:""
    },
  });
  useEffect(() => {
    if (user) {
      if (user.name) {
        form.setValue("name", user.name);
      }
      if (user.twitter) {
        form.setValue("twitterProfile", user.twitter);
      }
      if (user.linkedIn) {
        form.setValue("linkedInProfile", user.linkedIn);
      }
      if(user.email){
        form.setValue("email", user.email);
      }
      if(user.github){
        form.setValue("github", user.github);
      }
      if(user.description){
        form.setValue("description", user.description);
      }
      if(user.portfolio){
        form.setValue("portfolio", user.portfolio);
      }
      if(user.resume){
        form.setValue("resume", user.resume);
      }


      if(!user.name || !user.twitter || !user.linkedIn){
        setIsNoInfoAvail(true)
      }
    }
  }, [user]);

  useEffect(()=>{
     if(isNoInfoAvail){
      toast.warn("We will use this form to update your information in our database. Please fill the form with the correct information.")
     }
  },[isNoInfoAvail])
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof profileSchema>) {

    setIsLoading(true);

    const data = { ...values, id: userId};
 
    try {
      const res = await axios.post(`/api/user/edit`, data);
      

      if (res.status === 200) {
        toast.success("Profile Updated");
        router.push(`/profile/${userId}`);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    
    } finally {
      setIsLoading(false);
    }
  }

  if(!user){
    return <div className="flex justify-center items-center"><Loader size={24} className="animate-spin" /></div>
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Your Name</FormLabel>
              <FormControl>
                <Input {...field}
                placeholder="Enter your name"
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Email
              </FormLabel>
              <FormControl>
                <Input {...field} 
                           placeholder="Enter your email"
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className=" border-gray-700 text-lg"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedInProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Your LinkedIn Profile
              </FormLabel>
              <FormControl>
                <Input {...field}
                           placeholder="Enter your linkedin profile link"
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Twitter
              </FormLabel>
              <FormControl>
                <Input {...field}
                
                placeholder="Enter your twitter profile link"
                
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Github
              </FormLabel>
              <FormControl>
                <Input {...field} 
                placeholder="Enter your github profile link"
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Portfolio
              </FormLabel>
              <FormControl>
                <Input {...field}
                placeholder="Enter your portfolio profile link"
                className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Roles
              </FormLabel>
              <FormControl>
                <Input {...field} className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Resume
              </FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter your resume link"
                {...field} className="border-gray-700 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
               
        <Button type="submit" className="w-full text-base md:text-lg">
          {loading ? <Loader size={24} className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
