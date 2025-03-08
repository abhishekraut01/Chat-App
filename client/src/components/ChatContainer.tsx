import { useEffect } from "react";
import UseChatStore from "../store/UseChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const ChatContainer = () => {
  const { messages, getMessages, selectedUser, isMessagesLoading } =
    UseChatStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

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
      <p>messages.....</p>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
