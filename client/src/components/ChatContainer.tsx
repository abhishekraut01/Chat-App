import { useEffect } from "react"
import UseChatStore from "../store/UseChatStore"
import MessageSkeleton from "./skeletons/MessageSkeleton"

const ChatContainer = () => {
  const {messages , getMessages , selectedUser , setSelectedUser , isMessagesLoading}= UseChatStore()

  useEffect(()=>{
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  },[selectedUser , getMessages])

  if (isMessagesLoading) return <MessageSkeleton/>
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader/>
      <p>messages.....</p>
      <ChatInput/>
    </div>
  )
}

export default ChatContainer