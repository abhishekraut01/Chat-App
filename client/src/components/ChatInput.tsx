import { useRef, useState } from "react"

const ChatInput = () => {
    const [text , setText] = useState("")
    const [img , setImg] = useState(null)
    const fileInputRef = useRef()
  return (
    <div>ChatInput</div>
  )
}

export default ChatInput