import * as React from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { useAndroidBackHandler } from "@/hooks/useAndroidBackHandler";
import { useAuth } from "@/hooks/useAuth";

export function App() {
  const { user, isLoading } = useAuth();

  // Handle Android hardware back button
  useAndroidBackHandler();

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF9933] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AppRoutes user={user || null} />
  );
}
