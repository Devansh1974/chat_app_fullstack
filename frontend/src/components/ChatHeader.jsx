import { useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, typingUsers, inChatSearchQuery, setInChatSearchQuery } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const isTyping = typingUsers[selectedUser._id];

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="lg:hidden btn btn-ghost btn-circle btn-sm -ml-1 text-base-content hover:bg-base-300"
            title="Back to contacts"
            type="button"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div className="min-w-0">
            <h3 className="font-medium truncate">{selectedUser.fullName}</h3>
            {isTyping ? (
              <p className="text-xs text-primary font-medium animate-pulse flex items-center gap-1">
                typing...
              </p>
            ) : (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {showSearch ? (
            <div className="flex items-center gap-1 bg-base-200 rounded-lg px-2 py-1">
              <Search className="size-3.5 text-base-content/50" />
              <input
                type="text"
                autoFocus
                placeholder="Search messages..."
                value={inChatSearchQuery}
                onChange={(e) => setInChatSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-28 sm:w-44 text-base-content"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setInChatSearchQuery("");
                }}
                className="text-base-content/50 hover:text-base-content"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="btn btn-ghost btn-circle btn-sm"
              title="Search in conversation"
              type="button"
            >
              <Search className="size-4" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm"
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
