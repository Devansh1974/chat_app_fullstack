import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        position="top-center"
        containerStyle={{
          top: 72,
        }}
        gutter={8}
        toastOptions={{
          className: "!text-xs sm:!text-sm !py-2 !px-4 !rounded-full !shadow-2xl backdrop-blur-md",
          duration: 2500,
          style: {
            background: "rgba(24, 24, 27, 0.95)",
            color: "#f4f4f5",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            fontSize: "13px",
            fontWeight: "500",
            maxWidth: "90vw",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#18181b",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#18181b",
            },
          },
        }}
      />
    </div>
  );
};
export default App;
