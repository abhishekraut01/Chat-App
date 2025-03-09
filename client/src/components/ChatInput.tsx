import { useRef, useState } from "react";
import UseChatStore from "../store/UseChatStore";
import { Image, Send, X } from "lucide-react";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessages } = UseChatStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 


  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; 
    if (!file) return;

    setSelectedFile(file); 

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string); 
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    if(fileInputRef.current) fileInputRef.current.value = ""
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!text.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("text", text.trim()); // Add message text

    if (selectedFile) {
      formData.append("image", selectedFile); // Add image file
    }

    try {
    await sendMessages(formData); // Send FormData instead of JSON
    setText("");
    setImagePreview("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  } catch (error) {
    console.error("Failed to send message", error);
  }

  };

  return (
    <div className=" p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>

      </form>
    </div>
  );
};

export default ChatInput;
