"use client"
import { NavLinks } from "@/constants/NavLinks"
import React, { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {motion} from "framer-motion"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  let pathname = usePathname() || "/";
    return (
        <nav className="w-full h-fit py-4 md:py-9 flex justify-center items-center">
            <motion.div
            initial={{ opacity: 0 }} // Set initial opacity to 0
            animate={{ opacity: 1 }} // Animate opacity to 1
            transition={{ duration: 0.8 }}
            className="flex  justify-between items-center w-[1300px] md:px-6 md:ml-8 px-4 ">
                <h1 className="text-2xl">TechKareer</h1>
                <div className="md:flex flex-row justify-center items-center gap-4 hidden">
                    {
                        NavLinks.map((link, index) => (
                            <Link 
                             key={index} 
                             href={link.path}
                             className={cn("text-xs rounded-full bg-transparent font-bold px-5 py-3 border-[1px] border-solid border-transparent transition-all",
                                "hover:border-gray-200/60 transition-all duration-500",
                                pathname === link.path ? "border-gray-200/60" : "border-transparent"
                             )}>
                                <p>{link.name}</p>
                            </Link>
                        ))
                    }
                </div>
                <motion.button className="bg-[#15151f] px-6 py-3 border-[.1px] border-solid border-gray-200/10 rounded-full text-xs font-bold tracking-wider"
                    whileHover={{ backgroundColor: "#F9F9F9", color: "#000" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <p className="text-xs md:text-base">GET STARTED</p>
                </motion.button>
            </motion.div>
        </nav>
    )
}