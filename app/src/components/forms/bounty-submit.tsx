"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BountySchema } from "@/schema/form-schema";
import { Loader } from "lucide-react";
export function BountySubmit() {
  const form = useForm<z.infer<typeof BountySchema>>({
    resolver: zodResolver(BountySchema),
    defaultValues: {
      name: "",
      twitterProfile: "",
      linkedInProfile: "",
      submissionLink: "",
      notes: "",
      upiId: "",
      addToTalentPool: false,
    },
  });

  async function onSubmit(values: z.infer<typeof BountySchema>) {
    
    console.log(values);

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
                <Input   {...field} className="border-gray-700 text-lg"/>
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
              <FormLabel className="text-base md:text-lg ">Your Twitter Profile</FormLabel>
              <FormControl>
                <Input   {...field} className="border-gray-700 text-lg"/>
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
              <FormLabel className="text-base md:text-lg ">Your LinkedIn Profile</FormLabel>
              <FormControl>
                <Input   {...field} className="border-gray-700 text-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="submissionLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Your Submission Link</FormLabel>
              <FormControl>
                <Input   {...field} className="border-gray-700 text-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <FormField
          control={form.control}
          name="upiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Your UPI ID</FormLabel>
              <FormControl>
                <Input   {...field} className="border-gray-700 text-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Any feedbacks</FormLabel>
              <FormControl>
                <Input   {...field} className="border-gray-700 text-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addToTalentPool"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start justify-center space-x-3 space-y-0 rounded-md  p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  className="border-gray-400 text-lg mt-1"
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-lg">
                  Are you interested in being added to the Techkareer Talent
                  Pool?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-base md:text-lg">{

            form.formState.isLoading? "hello" : "Submit"
        }</Button>
      </form>
    </Form>
  );
}
