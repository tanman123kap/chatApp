import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const authStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(backendUrl, {
            query: {
                userId: authUser._id
            },
            withCredentials: true
        });
        socket.connect();
        set({socket: socket});
        socket.on("onlineUsers", (userId) => {
            set({onlineUsers: userId});
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect(); 
    },
    checkAuth: async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/checkauth`, {
                withCredentials: true
            });
            set({authUser: response.data.user});
            get().connectSocket();
        } catch (error) {
            set({authUser: null});
            const message = error.response?.data?.message || error.message;
            console.error(message);
        } finally {
            set({isCheckingAuth: false});
        }
    },
    signup: async (formData) => {
        try {
            set({isSigningUp: true});
            const response = await axios.post(`${backendUrl}/api/auth/signup`, formData, {
                withCredentials: true
            });
            set({authUser: response.data.user});
            toast.success("Signed Up Successfully!");
            get().connectSocket();
        } catch (error) {
            set({authUser: null});
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            set({isSigningUp: false});
        }
    },
    logout: async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/logout`, {
                withCredentials: true
            });
            set({authUser: null});
            toast.success(response.data.message);
            get().disconnectSocket();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        }
    },
    login: async (formData) => {
        try {
            set({isLoggingIn: true});
            const response = await axios.post(`${backendUrl}/api/auth/login`, formData, {
                withCredentials: true
            });
            set({authUser: response.data.user});
            toast.success("Logged In Successfully!");
            get().connectSocket();
        } catch (error) {
            set({authUser: null});
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            set({isLoggingIn: false});
        }
    },
    updateProfile: async (profilepic) => {
        try {
            set({isUpdatingProfile: true});
            const response = await axios.put(`${backendUrl}/api/auth/update-profile`, profilepic, {
                withCredentials: true
            });
            set({authUser: response.data.user});
            toast.success("Updated Successfully!");
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            set({isUpdatingProfile: false});
        }
    }
}));