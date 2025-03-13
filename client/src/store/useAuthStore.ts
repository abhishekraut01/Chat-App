import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";
import { io, Socket } from "socket.io-client";

interface AuthState {
  authUser: {
    _id: string;
    username?: string;
    email: string;
    password: string;
    avatar: string;
    createdAt?: string;
  } | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  error: string | null;
  onlineUsers: string[];
  socket : null | Socket  ;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: object) => Promise<void>;
  login: (data: object) => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
  connectSoket: () => Promise<void>;
  disconnectSoket: () => Promise<void>;
}

export const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

const useAuthStore = create<AuthState>((set , get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  error: null,
  onlineUsers: [],
  socket : null ,

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const res = await AxiosInstance.get("/auth/getuser");
      set({ authUser: res.data.data });
      get().connectSoket()
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null, error: handleError(error) });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, error: null });

    try {
      const res = await AxiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data });
      toast.success("Account created successfully");
      get().connectSoket()
    } catch (error) {
      console.error("Signup Error:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await AxiosInstance.post("/auth/logout");
      set({ authUser: null, error: null });
      toast.success("Logged out successfully");
      get().disconnectSoket()
    } catch (error) {
      console.error("Logout Error:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true, error: null });

    try {
      const res = await AxiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });
      get().connectSoket()
      toast.success("Login successfully");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (formData: FormData) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await AxiosInstance.patch("/auth/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ authUser: res.data.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile Update Error:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSoket: async ()=>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL)
    socket.connect()

    set({socket:socket})
  },

  disconnectSoket: async ()=>{
    if(get().socket?.connected) get().socket?.disconnect()
  },

}));

export default useAuthStore;
