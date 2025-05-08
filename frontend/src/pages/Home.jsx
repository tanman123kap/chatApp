import React from "react";
import NoChat from "../components/NoChat.jsx";
import Chat from "../components/Chat.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { chatStore } from "../store/chatStore.js";

const Home = () => {
  const {selectedUser} = chatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChat /> : <Chat />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home