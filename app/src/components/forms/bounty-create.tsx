"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TimePicker } from "antd";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { bountyCreateSchema } from "@/schema/form-schema";
import { CalendarIcon, Loader } from "lucide-react";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";

import { useUser } from "@/hooks/useUser";
import { FormSkeleton } from "./form-sekleton";

export function BountyCreate() {
  const [loading, setIsLoading] = React.useState(false);
  const { user } = useUser();
  const form = useForm<z.infer<typeof bountyCreateSchema>>({
    resolver: zodResolver(bountyCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      twitterLink: "",
      gigType: "",
    },
  });

  const router = useRouter();
  if (!user) {
    return <FormSkeleton />;
  }

  async function onSubmit(values: z.infer<typeof bountyCreateSchema>) {
    try {
      setIsLoading(true);
      const deadlineTime = `${values.deadlineTime.$H}:${values.deadlineTime.$m}`;
      const deadlineString =
        dayjs(values.deadlineDate).format("YYYY-MM-DD") + " " + deadlineTime;
      const deadline = dayjs(deadlineString).toISOString();
      const id = user?.id;
      const data = {
        ...values,
        deadline,
        id,
      };

      const response = await axios.post("/api/bounties/bounty/create", data);
      toast.success(response.data.message);
      router.push("/bounties");
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter title"
                  {...field}
                  className="border-gray-700 text-lg"
                />
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
              <FormLabel className="text-base md:text-lg ">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                  className="border-gray-700 text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Twitter link
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Twitter link"
                  {...field}
                  className="border-gray-700 text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gigType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">Gig Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Gig type"
                  {...field}
                  className="border-gray-700 text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg ">
                Amount (in $)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Bounty amount"
                  {...field}
                  className="border-gray-700 text-lg"
                  onChange={(event) => {
                    form.setValue("amount", parseInt(event.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-start items-center gap-2 lg:gap-8 mb-6">
          <FormField
            control={form.control}
            name="deadlineDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base md:text-lg ">
                  Deadline Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[285px] pl-3 text-left font-normal border-gray-600",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 border-none" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[285px] p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadlineTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base md:text-lg ">
                  Deadline Time
                </FormLabel>
                <FormControl>
                  <TimePicker
                    defaultValue={dayjs("12:00 AM", "HH:mm")}
                    format="HH:mm"
                    onChange={field.onChange}
                    className="w-[285px] h-[42px] border-gray-700 bg-transparent  hover:text-black  text-white placeholder:text-white text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full text-base md:text-lg">
          {loading ? <Loader size={24} className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
