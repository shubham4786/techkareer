import { Linkedin, Twitter } from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import Link from "next/link"
export const Footer = ()=>{
    return (
        <SectionWrapper>
            <footer className="border-t-[1px] border-solid border-white/80 flex justify-center items-center pt-12 flex-col ">
               <h1 className="font-semibold text-2xl md:text-4xl mb-8 md:mb-16">TechKareer</h1>
               <div className="flex flex-row gap-6 mb-5">
               <Twitter size={30} fill="white" />
               <Linkedin size={30}/>
               </div>
                <p className="text-sm text-gray-200/60 mb-5">© 2024 Techkareer. All rights reserved.</p>
                <div className="flex gap-5">
                    <Link href="/" className="text-sm underline">Privacy Policy</Link>
                    <Link href="/" className="text-sm underline">Terms of service</Link>
                </div>
            </footer>
        </SectionWrapper>
    )
}