import { Camera, Mail, Upload, User } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useState } from "react";

const ProfilePage = () => {
  const { isUpdatingProfile, authUser ,updateProfile} = useAuthStore();
  const [updatedImage , setUpdatedImage] = useState('')
  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if(!file) return 

    const reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onload = async ()=>{
      const base64Avatar = reader.result as string;
      setUpdatedImage(base64Avatar)
      await updateProfile({avatar:base64Avatar})
    }

  };

  if (!authUser) return;

  return (
    <div className="pt-20 h-screen">
      <div className=" max-w-2xl mx-auto p-4 py-8">
        {/* Upper  */}
        <div className="bg-base-300 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={updatedImage || authUser.avatar || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-4 bg-base-200 rounded-lg border">
                {authUser?.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-4 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* LOWER  */}

        <div className="bg-base-300 rounded-xl p-3 space-y-8 mt-3">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold ">Account Information</h1>

            <div className="flex justify-between">
              <p className="mt-5">Member since</p>
              <p className="mt-5 text-yellow-100">2023</p>
            </div>
            <div className="flex justify-between border-b-2 border-base-100 mt-3"></div>
            <div className="flex justify-between">
              <p className="mt-5 ">Account Status</p>
              <p className="mt-5 text-green-400">active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
