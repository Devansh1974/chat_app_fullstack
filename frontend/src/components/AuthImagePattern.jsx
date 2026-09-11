const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200/40 p-8 sm:p-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md text-center z-10 flex flex-col items-center">
        {/* Cute Boy & Girl Chatting 3D Illustration */}
        <div className="relative mb-6 group">
          <img
            src="/auth-chat-art.png"
            alt="People chatting"
            className="w-72 sm:w-80 h-auto max-h-[360px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
          />
        </div>

        <h2 className="text-2xl font-bold mb-3 tracking-tight">{title}</h2>
        <p className="text-base-content/70 text-sm leading-relaxed max-w-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
