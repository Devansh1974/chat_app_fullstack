import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { CheckCheck, ChevronDown, Copy } from "lucide-react";
import toast from "react-hot-toast";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    typingUsers,
    inChatSearchQuery,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isTyping = typingUsers[selectedUser._id];

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && !inChatSearchQuery) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, inChatSearchQuery]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 160;
    setShowScrollBottom(isScrolledUp);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyMessage = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filteredMessages = inChatSearchQuery.trim()
    ? messages.filter((m) =>
        m.text?.toLowerCase().includes(inChatSearchQuery.toLowerCase().trim())
      )
    : messages;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {inChatSearchQuery && (
          <div className="text-xs text-center text-base-content/60 py-1 bg-base-200/60 rounded-md">
            Found {filteredMessages.length} message{filteredMessages.length === 1 ? "" : "s"} matching "{inChatSearchQuery}"
          </div>
        )}

        {filteredMessages.map((message) => {
          const isMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1 flex items-center gap-1">
                <time className="text-xs opacity-50 flex items-center">
                  {formatMessageTime(message.createdAt)}
                  {isMe && (
                    <CheckCheck className="size-3.5 text-primary inline ml-1" />
                  )}
                </time>
              </div>
              <div className="chat-bubble flex flex-col group relative">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.image, "_blank")}
                  />
                )}
                {message.text && (
                  <p className="pr-4 break-words select-text">{message.text}</p>
                )}

                {message.text && (
                  <button
                    onClick={() => copyMessage(message.text)}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-75 hover:!opacity-100 transition-opacity p-0.5 rounded hover:bg-black/20"
                    title="Copy text"
                    type="button"
                  >
                    <Copy className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Real-time typing bubble */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                />
              </div>
            </div>
            <div className="chat-bubble flex items-center gap-1.5 py-3 px-4 bg-base-200 text-base-content shadow-sm">
              <span className="size-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="size-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="size-2 bg-primary/70 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Floating Scroll to bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 btn btn-circle btn-sm btn-primary shadow-lg z-20"
          title="Scroll to bottom"
          type="button"
        >
          <ChevronDown className="size-4" />
        </button>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
