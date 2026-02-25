import * as React from "react";
import { AppRoutes } from "@/routes/AppRoutes";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { useAndroidBackHandler } from "@/hooks/useAndroidBackHandler";

export function App() {
  const [user, setUser] = React.useState<{ name: string; profile: string; email: string; mobile?: string } | null>(null);

  // Handle Android hardware back button
  useAndroidBackHandler();

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }, []);

  return (
    <AppRoutes user={user} setUser={setUser} />
  );
}
