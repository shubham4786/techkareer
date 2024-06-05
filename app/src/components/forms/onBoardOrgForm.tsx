"use client";
import { CalendarIcon, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { onboardingOrgSchema }from "@/schema/form-schema";

  
const OrganizationOnboardForm = () => {

    const form = useForm<z.infer<typeof onboardingOrgSchema>>({
      resolver: zodResolver(onboardingOrgSchema),
      defaultValues: {
        name: "",
        website: "",
        overview: "",
      },
    });
  
    async function onSubmit(values: z.infer<typeof onboardingOrgSchema>) {

    //   const response = await db.organization.create({
    //     data: {
    //       name: values.name,
    //       website: values.website,
    //       foundedAt: values.foundedAt,
    //       overview: values.overview,
    //       location: values.location,
  
    //     },
    //   });
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl ml-2 mb-4 flex justify-start items-center gap-3">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Enter name of your organization"
                    className="w-[500px] mt-3 text-lg border-gray-800 py-6"
                    {...field}
                  />
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="foundedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-2xl  ml-2  mb-4 flex justify-start items-center gap-3">
                  Founded At
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[500px] pl-3 py-6 text-left text-lg font-normal border-gray-800",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select the date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[500px] flex justify-center items-center p-0 bg-black/90 text-white border-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl  ml-2  mb-4 flex justify-start items-center gap-3">
                  Website Url{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Enter your website url"
                    className="w-[500px] mt-3 text-lg border-gray-800 py-6"
                    {...field}
                  />
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl  ml-2  mb-4 flex justify-start items-center gap-3">
                  Website Url{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Enter your website url"
                    className="w-[500px] mt-3 text-lg border-gray-800 py-6"
                    {...field}
                  />
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl  ml-2  mb-4 flex justify-start items-center gap-3">
                  Overview{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Enter your company brief overview"
                    className="w-[500px] mt-3 text-lg border-gray-800 py-6"
                    {...field}
                  />
                </FormControl>
  
                <FormMessage />
              </FormItem>
            )}
          />
  
          <Button
            type="submit"
            className="px-4 py-3 text-lg min-w-[250px] align-left"
          >
            {
              form.formState.isLoading ? <Loader className="h-6 w-6 animate-spin" /> : "Submit"
            }
          </Button>
        </form>
      </Form>
    );
  };
  

  export default OrganizationOnboardForm ;