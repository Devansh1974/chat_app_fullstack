import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playNotificationSound } from "../lib/sound";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  typingUsers: {}, // { [userId]: boolean }
  unreadCounts: {}, // { [userId]: number }
  inChatSearchQuery: "",

  setInChatSearchQuery: (query) => set({ inChatSearchQuery: query }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  sendTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket?.connected && receiverId) {
      socket.emit("typing", { receiverId });
    }
  },

  sendStopTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket?.connected && receiverId) {
      socket.emit("stopTyping", { receiverId });
    }
  },

  clearUnread: (userId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0,
      },
    }));
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, users, unreadCounts } = get();
      const isCurrentChat = selectedUser && newMessage.senderId === selectedUser._id;

      // Play audio notification chime
      playNotificationSound();

      if (isCurrentChat) {
        set({ messages: [...messages, newMessage] });
      } else {
        // Increment unread count badge
        const currentCount = unreadCounts[newMessage.senderId] || 0;
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: currentCount + 1,
          },
        });

        const sender = users.find((u) => u._id === newMessage.senderId);
        const senderName = sender ? sender.fullName : "New message";
        toast(`${senderName}: ${newMessage.text || "Sent an attachment"}`);
      }
    });

    socket.off("userTyping");
    socket.on("userTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [senderId]: true,
        },
      }));
    });

    socket.off("userStoppedTyping");
    socket.on("userStoppedTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [senderId]: false,
        },
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, inChatSearchQuery: "" });
    if (selectedUser?._id) {
      get().clearUnread(selectedUser._id);
    }
  },
}));
