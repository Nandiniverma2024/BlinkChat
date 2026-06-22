import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore=create((set,get)=>({
    // Intially authUser is null, but when user loggedin we will update authUser
    authUser:null,
    isCheckingAuth:true,
    // Store Online users under an array
    onlineUsers:[],
    socket:null,

    // Run CheckAuth when users are authenticated
    checkAuth: async()=>{
        set({ isCheckingAuth: true });

        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            // if user is loggedin, called getSocket method
            get().connectSocket(res.data); //res.data => Authenticated user
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({authUser:null});
        }finally{
            set({ isCheckingAuth: false });
        }
    },

    clearAuth:() => {
        set({ authUser:null, isCheckingAuth: false, onlineUsers:[] });
        // when user logged out, called disconnected method
        get().disconnectSocket();
    },

    connectSocket: (user) => {
        // if user is undefined, don;t connect it to socket or if user is direct connected to socket
        if (!user || get().socket?.connected){
            return;
        }
        // if user is not connected, called io method and pass Base_url
        const socket = io(BASE_URL, { query: { userId: user._id } }); //line that connected to socket
        set({ socket });
        // Listen for the online user event (whenever need to listen, use socket.on)
        socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
    });
  },

    disconnectSocket: () => {
        // get socket object with getter method
        const socket = get().socket;
        if (socket?.connected) socket.disconnect();
        set({ socket: null });
    },

}));


