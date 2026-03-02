import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { mobileSchema, otpSchema, validateWithSchema } from "@/zod/authSchemas";
import { LOGIN_MESSAGES } from "@/config/messageConstants";
import { AUTH_REGEX } from "@/config/regexConstants";
import { ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { OTPInput } from "@/components/auth/OTPInput";
import { motion, AnimatePresence } from "framer-motion";
import { slideInLeft, slideInRight, transitions } from "@/config/animations";

type LoginStep = "mobile" | "otp";

interface LoginFormProps {
  onLogin: (userData: { name: string; profile: string; mobile: string; email: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [step, setStep] = React.useState<LoginStep>("mobile");
  const [resendTimer, setResendTimer] = React.useState(0);

  const {
    register,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      mobile: "",
      otp: "",
    },
  });

  const mobile = watch("mobile");
  const otp = watch("otp");

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const mobileField = register("mobile", {
    validate: validateWithSchema(mobileSchema, LOGIN_MESSAGES.errorInvalidMobile),
  });

  const { login } = useAuth();

  // Mutations
  const requestOtpMutation = useMutation({
    mutationFn: (mobileNumber: string) => authApi.requestOtp(mobileNumber),
    onSuccess: (response) => {
      setStep("otp");
      setResendTimer(30);
      toast.success(response.message || LOGIN_MESSAGES.toastOtpSent);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ mobileNumber, otp }: { mobileNumber: string; otp: string }) => 
      authApi.verifyOtp(mobileNumber, otp),
    onSuccess: (response) => {
      const { data, message } = response;
      const loginData = {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      login(loginData);
      onLogin(data.user);
      toast.success(message || LOGIN_MESSAGES.toastLoginSuccess);
    },
    onError: (error: any) => {
      toast.error(error.message || "Invalid OTP");
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (mobileNumber: string) => authApi.requestOtp(mobileNumber),
    onSuccess: (response) => {
      setResendTimer(30);
      setValue("otp", "", { shouldValidate: false });
      clearErrors("otp");
      toast.success(response.message || LOGIN_MESSAGES.toastOtpResent);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend OTP");
    },
  });

  const handleSendOtp = async () => {
    const isValid = await trigger("mobile");
    if (!isValid) {
      toast.error(errors.mobile?.message || LOGIN_MESSAGES.errorInvalidMobile);
      return;
    }
    requestOtpMutation.mutate(`+91${mobile}`);
  };

  const handleVerifyOtp = async () => {
    const parsed = otpSchema.safeParse(otp);
    if (!parsed.success) {
      setError("otp", { type: "validate", message: parsed.error.issues[0]?.message || LOGIN_MESSAGES.errorInvalidOtp });
      toast.error(parsed.error.issues[0]?.message || LOGIN_MESSAGES.errorInvalidOtp);
      return;
    }
    clearErrors("otp");
    verifyOtpMutation.mutate({ mobileNumber: `+91${mobile}`, otp });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    resendOtpMutation.mutate(`+91${mobile}`);
  };

  const isLoading = requestOtpMutation.isPending || verifyOtpMutation.isPending || resendOtpMutation.isPending;

  return (
    <AnimatePresence mode="wait">
      {step === "mobile" ? (
        <motion.div
          key="mobile"
          variants={slideInLeft}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitions.fast}
          className="space-y-4"
        >
          <Field>
            <FieldLabel htmlFor="login-mobile">
              Mobile Number <span className="text-red-500">*</span>
            </FieldLabel>
            <InputGroup className={errors.mobile ? "border-red-400 ring-2 ring-red-300/60 focus-within:border-red-400 focus-within:ring-red-300/60" : ""}>
              <InputGroupInput
                id="login-mobile"
                type="tel"
                placeholder="Enter mobile number"
                {...mobileField}
                onChange={(e) => {
                  const value = e.target.value.replace(AUTH_REGEX.nonDigitGlobal, "").slice(0, 10);
                  setValue("mobile", value, { shouldValidate: true });
                }}
              />
            </InputGroup>
            {errors.mobile?.message && <FieldError>{errors.mobile.message}</FieldError>}
          </Field>

          <Button className="h-11 w-full rounded-xl" onClick={handleSendOtp} disabled={isLoading}>
            {requestOtpMutation.isPending ? "Sending OTP..." : "Continue"}
            {!requestOtpMutation.isPending && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          variants={slideInRight}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitions.fast}
          className="space-y-4"
        >
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{LOGIN_MESSAGES.otpSentPrefix} {mobile}</p>
          <OTPInput
            value={otp}
            onChange={(value) => {
              setValue("otp", value, { shouldValidate: true });
              const parsed = otpSchema.safeParse(value);
              if (parsed.success) {
                clearErrors("otp");
              } else if (value.length > 0) {
                setError("otp", { type: "validate", message: parsed.error.issues[0]?.message || LOGIN_MESSAGES.errorInvalidOtp });
              }
            }}
            length={6}
            className="justify-center"
            onEnter={handleVerifyOtp}
          />
          {errors.otp?.message && <FieldError>{errors.otp.message}</FieldError>}
          <div className="text-center text-xs text-slate-500">
            {resendTimer > 0 ? (
              <span>Resend OTP in 00:{String(resendTimer).padStart(2, "0")}</span>
            ) : (
              <button type="button" onClick={handleResendOtp} className="font-semibold text-[#C96F00]" disabled={isLoading}>
                Resend OTP
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setStep("mobile")} disabled={isLoading}>Back</Button>
            <Button onClick={handleVerifyOtp} disabled={isLoading}>
              {verifyOtpMutation.isPending ? "Verifying..." : "Login"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
