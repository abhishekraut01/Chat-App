import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface AuthState {
  authUser: {
    username?:string,
    email:string,
    password:string,
    avatar?:string
  } | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  error: string | null;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: object) => Promise<void>;
  login: (data: object) => Promise<void>;
  updateProfile: (data: object) => Promise<void>;
}

const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  error: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const res = await AxiosInstance.get("/auth/getuser");
      set({ authUser: res.data });
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
      set({ authUser: res.data });
      toast.success("Account created successfully");
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
      set({ authUser: res.data });
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
  updateProfile: async (data) =>{
    set({isUpdatingProfile:true})
    try {
      const res = await AxiosInstance.post('/auth/updateProfile' , data);
      set({authUser:res.data.avatar})
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage);
      set({ error: errorMessage });
    }finally{
      set({isUpdatingProfile:false})
    }
  },

}));

export default useAuthStore;
