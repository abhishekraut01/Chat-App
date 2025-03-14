import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import useAuthStore, { handleError } from "./useAuthStore";
import toast from "react-hot-toast";

export type userData = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type messageData = {
  _id?: string;
  message: string;
  senderId?: string;
  recieverId?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface IUseChatStore {
  messages: messageData[];
  users: userData[];
  selectedUser: userData | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  error: string | null;

  getUsers: () => Promise<void>;
  subcribeToMessage: () => void;
  UnsubcribeToMessage: () => void;
  getMessages: (id: string) => Promise<void>;
  setSelectedUser: (selectedUser: userData | null) => void;
  sendMessages: (messageData: FormData) => Promise<void>;
}

const UseChatStore = create<IUseChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: null,

  getUsers: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await AxiosInstance.get("/message/getUsersInChat");
      set({ users: res.data.data });
    } catch (error) {
      console.log("error occured while getting usersInChat", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const res = await AxiosInstance.get(`/message/${id}`);
      set({ messages: res.data.data });
    } catch (error) {
      console.log("error occured while getting messages", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (messageData: FormData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await AxiosInstance.post(
        `/message/${selectedUser?._id}`,
        messageData,
        { headers: { "Content-Type": "multipart/form-data" } } // Required for file uploads
      );

      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      console.log("Error occurred while sending messages", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    }
  },

  subcribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId !== selectedUser._id;
      if (isMessageSendFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  UnsubcribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: userData | null) => {
    set({ messages: [] });
    set({ selectedUser: selectedUser });
  },
}));

export default UseChatStore;
