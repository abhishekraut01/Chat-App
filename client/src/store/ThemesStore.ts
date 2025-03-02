import toast from "react-hot-toast";
import { create } from "zustand";

interface IuseThemeStore {
  theme: string;
  setTheme: (theme:string) => void;
}

const useThemeStore = create<IuseThemeStore>((set) => ({
    theme:localStorage.getItem("chat-theme") || "",
    setTheme: (theme)=>{
        localStorage.setItem("chat-theme",theme);
        set({theme})
        toast.success("Theme changed successfully")
    }
}));

export default useThemeStore;