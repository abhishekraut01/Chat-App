import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import toast from "react-hot-toast";

interface AuthState {
  authUser: [] | null; 
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean; 
  isUpdatingProfile: boolean;
  error: string | null;
  
  checkAuth: () => Promise<void>;
  signup:(data:object) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false, // Fixed typo
  isUpdatingProfile: false,
  error: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const res = await AxiosInstance("/auth/getuser");
      set({ authUser: res.data });
    } catch (error) {
      console.error(`Error in checkAuth:`, error);
      set({ authUser: null, error: "Failed to authenticate user" });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data)=>{
    set({isSigningUp:true})
    try {
      const res = await AxiosInstance.post("/auth/signup",data)
      toast.success("account created successfully")
      set({authUser:res.data})
    } catch (error) {
      console.log(error)
    }finally {
      set({ isCheckingAuth: false });
    }
  }

}));

export default useAuthStore;
