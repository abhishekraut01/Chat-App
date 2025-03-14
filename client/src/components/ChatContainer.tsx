import { useEffect, useRef } from "react";
import UseChatStore from "../store/UseChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import useAuthStore from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessagesLoading,
    subcribeToMessage,
    UnsubcribeToMessage,
  } = UseChatStore();
  const { authUser } = useAuthStore();
  const messgaeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messgaeEndRef.current && messages) {
      messgaeEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subcribeToMessage();
    }

    return () => UnsubcribeToMessage();
  }, [selectedUser, getMessages, UnsubcribeToMessage, subcribeToMessage]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              authUser && message.senderId === authUser._id
                ? "chat-end"
                : "chat-start"
            }`}
            ref={messgaeEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser?._id
                      ? authUser?.avatar || "/avatar.png"
                      : selectedUser?.avatar || "/avatar.png"
                  }
                  alt="img"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt?.slice(0, 10)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  className="sm:max-w-[150px] rounded-md mb-2"
                  alt=""
                />
              )}
              {message.message && <p>{message.message}</p>}
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
