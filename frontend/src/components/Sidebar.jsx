import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users, X } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadCounts,
    typingUsers,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
    const matchesSearch = user.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <span className="font-semibold hidden lg:block">Contacts</span>
          </div>
          <span className="text-xs text-zinc-500 hidden lg:inline">
            ({Math.max(0, onlineUsers.length - 1)} online)
          </span>
        </div>

        {/* Contact Search Bar */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-base-content/40" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 pr-8 text-sm focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-base-content/40 hover:text-base-content"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-xs text-base-content/80">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user._id] || 0;
          const isUserTyping = typingUsers[user._id];

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300/60 transition-colors relative
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
                {/* Mobile unread badge indicator */}
                {unread > 0 && (
                  <span className="lg:hidden absolute -top-1 -right-1 size-5 bg-primary text-primary-content text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>

              {/* User info - visible on larger screens */}
              <div className="hidden lg:flex flex-1 items-center justify-between min-w-0">
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate text-sm">{user.fullName}</div>
                  <div className="text-xs truncate">
                    {isUserTyping ? (
                      <span className="text-primary font-medium animate-pulse">typing...</span>
                    ) : onlineUsers.includes(user._id) ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      <span className="text-zinc-500">Offline</span>
                    )}
                  </div>
                </div>

                {/* Desktop Unread Badge Counter */}
                {unread > 0 && (
                  <span className="badge badge-primary badge-sm font-semibold ml-2">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-6 text-sm">
            {searchQuery ? "No matching contacts found" : "No contacts available"}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
