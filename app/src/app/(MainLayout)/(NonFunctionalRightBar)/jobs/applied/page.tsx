"use client";
import { WithAuthSeeker } from "@/components/HOC/withAuthSeeker";
import {AppliedJobList, BottomBar} from "@/components/components";
import {  Navbar } from "@/components/components";
import React, { useEffect, useRef, useState } from "react";
import { FaSort } from "react-icons/fa6";
interface statusType{
    name:string,
    value:string
}
function JobsAppliedPage() {
  const [isOpen, setIsOpen] = useState(false);
    const[status,setStatus]=useState<statusType>({name:"All",value:"applied"})
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const closeDropdown = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
    
    useEffect(() => {
        document.addEventListener("click", closeDropdown);
    
        return () => {
          document.removeEventListener("click", closeDropdown);
        };
      }, []);
    
    return (
    <>
      <Navbar>
        Jobs Applied
        <div className="relative">
          <div
          ref={dropdownRef}
            className="border-[2px] cursor-pointer px-2 py-1 rounded-full btn-container flex items-center gap-1 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="text">{status.name}</div>
            <FaSort className="text-[16px]" />
          </div>
          {isOpen && (
            <div
              className="absolute cursor-pointer right-[-1rem] z-10 mt-3 w-60   origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {[
                    {name:"All",value:"applied"},
                    {name:"Accepted",value:"accepted"},
                    {name:"Pending",value:"pending"},
                    {name:"Rejected",value:"rejected"}

                ].map((item,index)=><div
                key={index}
                  onClick={() => {
                    setStatus(item);
                  }}
                  className="text-gray-700 font-700   px-2 py-2 text-[14px]"
                  role="menuitem"
                  id="menu-item-0"
                >{item.name}
                </div>)}
              </div>
            </div>
          )}
        </div>
      </Navbar>
      <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full ">
        <AppliedJobList status={status.value}/>
      </div>
      <BottomBar></BottomBar>
          </>
  );
}

export default WithAuthSeeker(JobsAppliedPage);
