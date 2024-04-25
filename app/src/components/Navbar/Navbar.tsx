import React from "react";

function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="nav-section w-full flex justify-between  items-center px-5 gap-5 border-b-[1px] border-b-[solid] border-b-[#E1E4E8] h-[10vh] max-h-[10vh]">
        <div className="w-full   flex justify-between items-center text-[16px]">
          {children}
        </div>
      </div>
    </>
  );
}

export default Navbar;
