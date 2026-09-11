import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";

// Client-side image compression to speed up uploads & prevent PayloadTooLarge errors
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSendingMessage, selectedUser, sendTyping, sendStopTyping } =
    useChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error("Image compression error:", err);
      toast.error("Failed to process image");
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (!selectedUser?._id) return;

    if (val.trim()) {
      sendTyping(selectedUser._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedUser._id);
      }, 1500);
    } else {
      sendStopTyping(selectedUser._id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imagePreview) || isSendingMessage) return;

    // Clear typing timeout immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (selectedUser?._id) sendStopTyping(selectedUser._id);

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Reset form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center hover:bg-base-content/20 transition-colors"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
          {isCompressing && (
            <span className="text-xs text-base-content/60 flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" /> Optimizing image...
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:outline-none focus:border-primary"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
            disabled={isSendingMessage}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSendingMessage}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-ghost
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage}
          >
            {isCompressing ? <Loader2 className="size-5 animate-spin" /> : <Image size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
        >
          {isSendingMessage ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
