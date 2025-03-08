import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import { handleError } from "./useAuthStore";
import toast from "react-hot-toast";

export type userData = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  createdAt: Date
  updatedAt: Date;
};

export type messageData = {
  _id: string;
  message: string;
  senderId: string;
  recieverId: string;
  image: string;
  createdAt: Date
  updatedAt: Date;
};

interface IUseChatStore {
  messages: string[];
  users: userData[];
  selectedUser: userData | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  error: string | null;

  getUsers: () => Promise<void>;
  getMessages: (id: string) => Promise<void>;
  setSelectedUser: (selectedUser: userData | null) => void;
  sendMessages: (messageData: messageData ) => Promise<void>;
}

const UseChatStore = create<IUseChatStore>((set , get) => ({
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

  sendMessages: async (messageData)=>{
    const {selectedUser , messages} = get();
    try {
      const res = await AxiosInstance.post(`/message/${selectedUser}` , messageData);
      set({messages:[...messages , res.data.data]})
    } catch (error) {
      console.log("error occured while sending messages", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    }
  },

  setSelectedUser: (selectedUser:userData | null) => set({ selectedUser: selectedUser }),
}));

export default UseChatStore;
