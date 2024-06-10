"use client"
import logo from '@/assets/logo.webp'
import { BountySubmit } from '@/components/forms/bounty-submit'
import { FormSkeleton } from '@/components/forms/form-sekleton'
import { useFetchSingleBounty } from '@/hooks/useJobData'
import { useUser, useUserInfo } from '@/hooks/useUser'
import { Linkedin, Loader, Mail, Phone, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
const page = ({
    params
}:{
    params:{
        id:string
    }
})=>{
const {user:session} = useUser()
    return(
        <div className="flex justify-center items-center flex-col pt-16 px-3 ">
           <div className='mb-8'>
            <Image
                src={logo}
                alt="logo"
                width={200}
                height={200}
                />
            </div>
            <div className='text-center flex flex-col  px-6 '>
                <p className=' text-lg md:text-xl mb-2'>Thank you for visiting TechKareer's Bounty Submission form!</p>
                <p className=' text-lg md:text-xl mb-5'>Please fill this form to make the submission for the bounty you are participating in.</p>
                <span className='text-gray-500 text-sm underline mb-6'>Contact us if there is any issues</span>
                 <div className='flex justify-center items-center gap-4 flex-wrap'>
                   {
                          socials.map((social,index)=>(
                            <Link   key={index} href={social.url} target="_blank" rel="noreferrer">
                            <div className={`flex justify-center items-center gap-2 w-fit ${social.color} px-4 py-2  rounded-3xl`}>
                        
                                      {social.icon}
                 
                                 <p>{social.name}</p>
                            </div>
                            </Link>
                          ))
                   }
                 </div>
                
            </div>
            <div className='md:min-w-[50%] py-16 flex justify-center items-center'>
                {session ? <BountySubmit id={params.id} userId={session.id.toString()} /> : <FormSkeleton />}
            </div>
 
        </div>

    )
}


export default page


type socialsProps = {
    name:string,
    url:string,
    icon:React.ReactNode,
    color:string

}
const socials: socialsProps[] =[
    {
        name:'twitter',
        url:'https://twitter.com/itsharshag',
        icon:<Twitter size={20} />,
        color:"bg-blue-800"
    },
    {        
        name:'LinkedIn',
        url:'https://www.linkedin.com/in/itsharshag/',
        icon:<Linkedin size={20} />,
        color:"bg-blue-600"
    },
    {
        name:'Email',
        url:'https://www.linkedin.com/in/itsharshag/',
        icon:<Mail size={20} />,
        color:"bg-red-700"
    },
    {
        name:'WhatsApp',
        url:'https://wa.link/7w0k3n',
        icon:<Phone size={20} />,
        color:"bg-green-400"
    }
]