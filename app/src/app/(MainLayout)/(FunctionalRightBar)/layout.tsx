import { BottomBar, FilterForm, Rightbar } from "@/components/components";
import React from "react";

function FunctionRightBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="content-wrapper max-sm:w-[100%] max-md:w-[80%] w-[60%] h-[100vh] flex flex-col border-x-[1px] border-x-[solid] border-x-[#E1E4E8]">
        {children} 
      </div>
      <Rightbar>
        <FilterForm></FilterForm>
      </Rightbar>
    </>
  );
}

export default FunctionRightBarLayout;
