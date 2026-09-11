import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Heart, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp, guestLogin, isLoggingInGuest } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-16 lg:pt-0">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 pt-6 sm:pt-12">
        <div className="w-full max-w-md space-y-6">
          {/* Cute 3D Character Illustration - Visible on Mobile & Tablet */}
          <div className="lg:hidden flex flex-col items-center mb-1 mt-2">
            <img
              src="/auth-chat-art.png"
              alt="Cute characters chatting"
              className="w-36 sm:w-44 h-auto max-h-36 object-contain drop-shadow-lg select-none pointer-events-none hover:scale-105 transition-transform"
            />
          </div>

          {/* LOGO - Hidden on mobile to avoid duplicate stacking */}
          <div className="text-center mb-4">
            <div className="flex flex-col items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Chatty Logo"
                className="hidden lg:block size-14 sm:size-16 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <h1 className="text-2xl font-bold mt-1">Create Account</h1>
              <p className="text-base-content/60 text-sm">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp || isLoggingInGuest}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Quick Demo / Guest Access */}
          <div className="space-y-3">
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-100 px-2 text-base-content/60 font-medium">Or Explore Immediately</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => guestLogin("guest")}
              disabled={isLoggingInGuest || isSigningUp}
              className="btn btn-outline btn-secondary w-full gap-2 shadow-sm"
            >
              {isLoggingInGuest ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Logging in as Guest...
                </>
              ) : (
                <>
                  <Sparkles className="size-5 text-secondary" />
                  Continue as Guest
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-base-content/60 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Developer Credit Footer */}
          <div className="text-center pt-4 border-t border-base-300/40">
            <p className="text-xs text-base-content/60 flex items-center justify-center gap-1">
              Developed with <Heart className="size-3.5 text-red-500 fill-red-500 animate-pulse" /> by{" "}
              <a
                href="https://www.linkedin.com/in/devanshsingh2006"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Devansh
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;
