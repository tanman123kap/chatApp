import React, { useEffect, useRef } from "react";
import { chatStore } from "../store/chatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./MessageSkeleton.jsx";
import { authStore } from "../store/authStore.js";

const Chat = () => {
    const { messages, getMessages, isMessageLoading, selectedUser, realTimeMessages, notRealTimeMessages } = chatStore();
    const { authUser } = authStore();
    const messageEndRef = useRef(null);
    useEffect(() => {
        getMessages(selectedUser._id);
        realTimeMessages();
        return () => notRealTimeMessages();
    }, [selectedUser._id, getMessages, realTimeMessages, notRealTimeMessages]);
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    return (
        <>
            {isMessageLoading ? <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div> : <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message._id} className={`chat ${message.sender === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={message.sender === authUser._id ? authUser.profilepic || "/profilepic.png" : selectedUser.profilepic || "/profilepic.png"} alt="Profile Pic" />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-mb mb-2" />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <MessageInput />
            </div>}
        </>
    )
}

export default Chat