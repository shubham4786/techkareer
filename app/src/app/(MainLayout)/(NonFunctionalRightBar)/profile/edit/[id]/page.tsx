import { BottomBar, Navbar } from "@/components/components";
import { EditProfileForm } from "@/components/forms/profile-edit";
const EditProfile = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <>
      <Navbar className="pt-8">Edit Profile</Navbar>
      <div className="w-full">
        <div className="px-8  py-16 ">
          <EditProfileForm userId={params.id} />
        </div>
      </div>
      <BottomBar></BottomBar>
    </>
  );
};

export default EditProfile;
