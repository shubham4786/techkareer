import { BottomBar, Navbar } from "@/components/components"
import { BountyCreate } from "@/components/forms/bounty-create";
import { ChevronRight } from "lucide-react";
const CreateBounty = () => {
  return (
    <>
      <Navbar className="pt-8 flex justify-start gap-3 items-center ">Create Bounty
      <ChevronRight className="text-gray-600 "/>
      </Navbar>
      <div className="flex justify-center items-center mt-8 mb-8 flex-col gap-16">
        <div className="flex justify-center items-start flex-col  lg:w-[600px] px-2 lg:px-0">
          <h2 className="text-blue-500 text-2xl lg:text-5xl">Create Your Bounty</h2>
          <div className="mt-3">
          <p className="lg:text-xl text-md text-gray-400">You can add bounty here, it will be displayed on our bounties page</p>
          <p className="lg:text-xl text-md text-gray-400">Everyone can see the bounties infomation as it will be public</p>
          </div>
        </div>
        <div className="w-fit lg:w-[600px] px-3 lg:px-0 mb-9">
          <BountyCreate/>
        </div>
      </div>
      <BottomBar></BottomBar>
    </>
  );
};

export default CreateBounty;
