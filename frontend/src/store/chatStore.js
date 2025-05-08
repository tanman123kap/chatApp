import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { authStore } from "./authStore.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const chatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    getUsers: async () => {
        try {
            set({isUserLoading: true});
            const response = await axios.get(`${backendUrl}/api/message/user-sidebar`, {
                withCredentials: true
            });
            set({users: response.data.users});
        } catch(error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            set({isUserLoading: false});
        }
    },
    getMessages: async (id) => {
        try {
            set({isMessageLoading: true});
            const response = await axios.get(`${backendUrl}/api/message/${id}`, {
                withCredentials: true
            });
            set({messages: response.data.message});
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            set({isMessageLoading: false});
        }
    },
    sendMessage: async (messageData) => {
        try {
            const {selectedUser, messages} = get();
            const response = await axios.post(`${backendUrl}/api/message/send/${selectedUser._id}`, messageData, {
                withCredentials: true
            });
            set({messages: [...messages, response.data.message]});
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        }
    },
    realTimeMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = authStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if(newMessage.sender !== selectedUser._id) return;
            set({messages: [...get().messages, newMessage]});
        });
    },
    notRealTimeMessages: () => {
        const socket = authStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({selectedUser})
}));