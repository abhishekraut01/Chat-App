import { create } from "zustand";
import { AxiosInstance } from "../lib/AxiosInstance";
import { handleError } from "./useAuthStore";

interface IUseChatStore{
    messages :string[];
    users:string[];
    selectedUser:null;
    isUsersLoading:boolean;
    isMessagesLoading:boolean;
    error: string | null,

    getUsers: ()=>Promise<void>
    getMessages: (id:string)=>Promise<void>
}

const UseChatStore = create<IUseChatStore>((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    error: null,


    getUsers: async ()=>{
        set({ isUsersLoading:true , error:null })
        try {
            const res =await AxiosInstance.get('/message/getUsersInChat')
            set({users:res.data.data})
        } catch (error) {
            console.log("error occured while getting usersInChat",error)
            set({isUsersLoading:false , error: handleError(error)} )
        }finally{
            set({isUsersLoading:false})
        }
    },

    getMessages: async (id)=>{
        set({ isMessagesLoading:true , error:null })
        try {
            const res =await AxiosInstance.get(`/message/${id}`)
            set({messages:res.data.data})
        } catch (error) {
            console.log("error occured while getting messages",error)
            set({isMessagesLoading:false , error: handleError(error)} )
        }finally{
            set({isMessagesLoading:false})
        }
    },
}));

export default UseChatStore