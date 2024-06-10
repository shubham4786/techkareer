
import { BottomBar, Navbar } from "@/components/components";
import { EditProfileForm } from "@/components/forms/profile-edit";
import { ChevronRight } from "lucide-react";
const EditProfile = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {


  return (
    <>

      <Navbar className="pt-8 flex justify-start gap-3 items-center ">Edit Profile
      <ChevronRight className="text-gray-600 "/>
      </Navbar>
      <div className="flex justify-center items-center mt-8 mb-8 flex-col gap-16">
        <div className="flex justify-center items-start flex-col  lg:w-[600px] px-2 lg:px-0">
          <h2 className="text-blue-500 text-2xl lg:text-5xl">User Infomation</h2>
          <div className="mt-3">
          <p className="lg:text-xl text-md text-gray-400">Here you can edit your public information about yourself.</p>
          <p className="lg:text-xl text-md text-gray-400">The changes will be displayed for other users as you update it.</p>
          </div>
        </div>
        <div className="w-fit lg:w-[600px] px-3 lg:px-0 mb-9">
          <EditProfileForm userId={params.id} />
        </div>
      </div>
      <BottomBar></BottomBar>
    </>
  );
};

export default EditProfile;
