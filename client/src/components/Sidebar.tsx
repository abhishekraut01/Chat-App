import { useEffect } from "react";
import UseChatStore from "../store/UseChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { isUsersLoading, users, selectedUser, getUsers, setSelectedUser } =
    UseChatStore();

  const onlineUsers:string[] = [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* online filter toggle */}
      </div>

      <div className="overflow-y-auto w-full py-3 ">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                                ${
                                  selectedUser && selectedUser._id === user._id
                                    ? "bg-base-300 ring-1 ring-base-300"
                                    : ""
                                }
                        `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.username}
                className="size-12 rounded-full object-cover"
              />
              {
                onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2"></span>
                )
              }
            </div>

            <div className="chidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.username}</div>
                <div className="text-sm text-zinc-500">
                    {onlineUsers.includes(user._id) ? "online" : "offline"}
                </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
