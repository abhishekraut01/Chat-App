import { useEffect } from "react"
import UseChatStore from "../store/UseChatStore"

const ChatContainer = () => {
  const {messages , getMessages , selectedUser , setSelectedUser , isMessagesLoading}= UseChatStore()

  useEffect(()=>{
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  },[selectedUser , getMessages])

  if (isMessagesLoading) return 
  return (
    <div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  )
}

export default ChatContainer