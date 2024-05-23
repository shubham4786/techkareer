"use client"
import Image from "next/image";
import logo from '@/assets/logo.webp';
import Link from "next/link";
import { CircleCheck, CircleUserRound, User } from "lucide-react";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter } from "next/navigation";

const page = () =>{

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const nameParam = params.get('name');
         console.log(nameParam)
      }, []);
    
     const params = usePathname()
     console.log(params)
    return (
        <div className="flex justify-start ">
            <OnboardSideBar/>
            <div className=" py-10 px-6 min-h-[100vh] w-full">
            <h1 className="text-5xl text-blue-400 mb-16">Welcome JobSeeker</h1>
            <UserNameForm/>
            </div>
            
        </div>
    )
}

export default page;


const  OnboardSideBar = () =>{
  return (
    <div className="flex flex-col justify-start items-center px-8 py-10 border-r border-solid border-gray-200/20">
      <Image 
      src={logo}
        alt="TechKareer"
        width={300}
        height={300}
        />

        <div className="flex justify-start items-start  mt-16 flex-col gap-6 w-full">
             {
                options.map((option, indexed) =>(
                    <Link key={indexed} href={option.link} className="flex justify-start items-center gap-3 hover:bg-gray-700/20 w-full px-4 py-2 rounded-2xl transition-all">
                        <CircleCheck color="#2ec27e" size={35}/>
                        <p className="text-2xl">{option.name}</p>
                    </Link>
                
                ))
             }
        </div>
    </div>
  )
}

const options = [
    {
        name:"General",
        link : '/onboarding'
    },
    {
        name:"Details",
        link : '/onboarding/details'
    }
]

const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    role: z
    .string({
      required_error: "Please select a role.",
    })
   
  })

const UserNameForm = ( )=>{

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)


  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl mb-4 flex justify-start items-center gap-3">
              Username </FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Enter you desired username" className="w-[500px] mt-3 text-lg" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
              <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
            <FormLabel className="text-3xl mb-4 flex justify-start items-center gap-3">
          
          Role </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[500px]">
                    <SelectValue placeholder="Select a role." className="w-[500px]"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-[500px] text-lg">
                  <SelectItem value="JobSeeker">JobSeeker</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
             
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}