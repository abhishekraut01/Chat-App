import { Sidebar } from "lucide-react"
import UseChatStore from "../store/UseChatStore"
import NoChatSelected from "../components/NoChatSelected"

const HomePage = () => {
  const {selectedUser} = UseChatStore()
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4 bg-gray-400">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="h-full flex rounded-lg overflow-hidden bg-green-900">
            <Sidebar/>

            {! selectedUser : <NoChatSelected/> : <ChatContainer/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage