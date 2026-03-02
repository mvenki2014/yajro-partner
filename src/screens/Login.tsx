import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown, fadeInScale, transitions, getSlideVariants } from "@/config/animations";

type AuthMode = "login" | "register";

export function Login({
  onLogin,
}: {
  onLogin: (userData: { name: string; profile: string; mobile: string; email: string }) => void;
}) {
  const [mode, setMode] = React.useState<AuthMode>("login");

  useSetShell({
    title: null,
    footer: null,
    bottomNav: null,
  });

  return (
    <div className="min-h-[85vh] bg-transparent flex items-center">
      <div className="mx-auto w-full max-w-sm min-h-[640px]">
        <motion.div 
          variants={fadeInDown}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitions.slow}
          className="mb-5 text-center"
        >
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9933] to-amber-500 shadow-md shadow-orange-200">
            <img src="/images/yajro-logo.png" alt="Yajro Logo" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Yajro Priests</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {mode === "login"
              ? "Login to manage bookings and earnings"
              : "Complete registration to become a partner"}
          </p>
        </motion.div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        <motion.div
          variants={fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ...transitions.default, ease: "easeOut", duration: 0.4 }}
        >
          <Card className="border-slate-200 bg-white/50 shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{mode === "login" ? "Welcome Back" : "Join as Priests"}</CardTitle>
              <CardDescription>
                {mode === "login" 
                  ? "Enter your mobile to continue" 
                  : "Fill details to start your journey"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  variants={getSlideVariants(mode === "login" ? "left" : "right")}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transitions.default}
                >
                  {mode === "login" ? (
                    <>
                      <LoginForm onLogin={onLogin} />
                      <p className="mt-4 px-1 text-center text-[10px] leading-relaxed text-slate-400">
                        By logging in, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </>
                  ) : (
                    <RegisterForm 
                      onLogin={onLogin} 
                      onBackToLogin={() => setMode("login")} 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
