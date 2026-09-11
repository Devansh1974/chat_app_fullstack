const NoChatSelected = () => {
  return (
    <div className="hidden lg:flex w-full flex-1 flex-col items-center justify-center p-8 sm:p-16 bg-base-100/50 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 size-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md text-center space-y-4 z-10 flex flex-col items-center">
        {/* Cute 3D Character Illustration */}
        <div className="relative group mb-2">
          <img
            src="/auth-chat-art.png"
            alt="Welcome to Chatty"
            className="w-52 sm:w-60 h-auto max-h-48 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
          />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Chatty!</h2>
        <p className="text-base-content/60 text-sm max-w-xs leading-relaxed">
          Select a conversation from the contacts list to start messaging in real-time
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
