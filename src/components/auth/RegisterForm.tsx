import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import appData from "@/data/app-data.json";
import { REGISTER_MESSAGES } from "@/config/messageConstants";
import { AUTH_REGEX } from "@/config/regexConstants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { OTPInput } from "@/components/auth/OTPInput";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { slideInLeft, slideInRight, transitions } from "@/config/animations";
import {
  mobileSchema,
  otpSchema,
  registrationDetailsSchema,
  registrationSchema,
  validateWithSchema,
} from "@/zod/authSchemas";

const LANGUAGE_OPTIONS = appData.registrationLanguages as string[];
const SERVICE_LOCATIONS = appData.serviceLocations as string[];

type RegisterStep = "registration" | "registrationDetails" | "regOtp";

interface RegisterFormProps {
  onLogin: (userData: { name: string; profile: string; mobile: string; email: string }) => void;
  onBackToLogin: () => void;
}

export function RegisterForm({ onLogin, onBackToLogin }: RegisterFormProps) {
  const [step, setStep] = React.useState<RegisterStep>("registration");
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
      fullName: "",
      email: "",
      experience: "",
      languagesKnown: [] as string[],
      serviceLocation: "",
    },
  });

  const mobile = watch("mobile");
  const otp = watch("otp");
  const fullName = watch("fullName");
  const email = watch("email");
  const languagesKnown = watch("languagesKnown") as string[];
  const serviceLocation = watch("serviceLocation");

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const mobileField = register("mobile", {
    validate: validateWithSchema(mobileSchema, REGISTER_MESSAGES.errorInvalidMobile),
  });
  const fullNameField = register("fullName", {
    validate: validateWithSchema(registrationSchema.shape.fullName, "Full name is required"),
  });
  const emailField = register("email", {
    validate: validateWithSchema(registrationSchema.shape.email, REGISTER_MESSAGES.errorInvalidEmail),
  });
  const experienceField = register("experience", {
    validate: validateWithSchema(registrationDetailsSchema.shape.experience, "Experience is required"),
  });

  const { login } = useAuth();

  // Mutations
  const registerInitiateMutation = useMutation({
    mutationFn: (data: any) => authApi.registerInitiate(data),
    onSuccess: (response) => {
      setStep("regOtp");
      setResendTimer(30);
      toast.success(response.message || "OTP sent to your mobile number");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to initiate registration");
    },
  });

  const registerVerifyMutation = useMutation({
    mutationFn: (data: { mobileNumber: string; otp: string }) => authApi.registerVerifyOtp(data),
    onSuccess: (response) => {
      const { data, message } = response;
      const loginData = {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      login(loginData);
      onLogin(data.user);
      toast.success(message || REGISTER_MESSAGES.toastRegistrationComplete);
    },
    onError: (error: any) => {
      toast.error(error.message || "Invalid OTP");
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: { mobileNumber: string }) => authApi.registerResendOtp(data),
    onSuccess: (response) => {
      setResendTimer(30);
      setValue("otp", "", { shouldValidate: false });
      clearErrors("otp");
      toast.success(response.message || REGISTER_MESSAGES.toastOtpResent);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend OTP");
    },
  });

  const handleRegistrationContinue = async () => {
    const isValid = await trigger(["mobile", "fullName", "email"]);
    if (!isValid) {
      toast.error(REGISTER_MESSAGES.errorFixHighlightedFields);
      return;
    }
    setStep("registrationDetails");
    toast.success(REGISTER_MESSAGES.toastBasicInfoSaved);
  };

  const handleRegistrationDetailsContinue = async () => {
    const isValid = await trigger(["experience"]);
    const detailsParsed = registrationDetailsSchema.safeParse({
      experience: watch("experience"),
      languagesKnown,
      serviceLocation,
    });

    if (!isValid || !detailsParsed.success) {
      if (!detailsParsed.success) {
        for (const issue of detailsParsed.error.issues) {
          const field = issue.path[0];
          if (field === "languagesKnown" || field === "serviceLocation" || field === "experience") {
            setError(field as any, { type: "validate", message: issue.message });
          }
        }
      }
      toast.error(REGISTER_MESSAGES.errorCompleteRequiredDetails);
      return;
    }

    clearErrors(["experience", "languagesKnown", "serviceLocation"]);
    registerInitiateMutation.mutate({
      mobileNumber: `+91${mobile}`,
      fullName: fullName,
      email: email,
      experienceYears: parseInt(watch("experience")),
      serviceLocation: serviceLocation,
      languagesKnown: languagesKnown,
    });
  };

  const handleRegisterOtpSubmit = async () => {
    const parsed = otpSchema.safeParse(otp);
    if (!parsed.success) {
      setError("otp", { type: "validate", message: parsed.error.issues[0]?.message || REGISTER_MESSAGES.errorInvalidOtp });
      toast.error(parsed.error.issues[0]?.message || REGISTER_MESSAGES.errorInvalidOtp);
      return;
    }
    clearErrors("otp");
    registerVerifyMutation.mutate({
      mobileNumber: `+91${mobile}`,
      otp: otp,
    });
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    resendOtpMutation.mutate({ mobileNumber: `+91${mobile}` });
  };

  const isLoading = registerInitiateMutation.isPending || registerVerifyMutation.isPending || resendOtpMutation.isPending;

  return (
    <div className="space-y-4">
      <RegisterStepProgress step={step} />

      <AnimatePresence mode="wait">
        {step === "registration" && (
          <motion.div
            key="registration"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.fast}
            className="space-y-3"
          >
            <Field>
              <FieldLabel htmlFor="reg-mobile">
                Mobile Number <span className="text-red-500">*</span>
              </FieldLabel>
              <InputGroup className={errors.mobile ? "border-red-400 ring-2 ring-red-300/60 focus-within:border-red-400 focus-within:ring-red-300/60" : ""}>
                <InputGroupInput
                  id="reg-mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  {...mobileField}
                  onChange={(e) => {
                    const value = e.target.value.replace(AUTH_REGEX.nonDigitGlobal, "").slice(0, 10);
                    setValue("mobile", value, { shouldValidate: true });
                  }}
                />
              </InputGroup>
              {errors.mobile?.message && <FieldError>{String(errors.mobile.message)}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="reg-full-name">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="reg-full-name"
                placeholder="Enter your full name"
                {...fullNameField}
                className={errors.fullName ? "border-red-400 focus-visible:ring-red-300/60 focus-visible:border-red-400" : ""}
              />
              {errors.fullName?.message && <FieldError>{String(errors.fullName.message)}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="reg-email">
                Email <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="reg-email"
                placeholder="Enter your email address"
                {...emailField}
                className={errors.email ? "border-red-400 focus-visible:ring-red-300/60 focus-visible:border-red-400" : ""}
              />
              {errors.email?.message && <FieldError>{String(errors.email.message)}</FieldError>}
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={onBackToLogin}>
                Back
              </Button>
              <Button onClick={handleRegistrationContinue} disabled={isLoading}>
                {isLoading ? "Saving..." : "Next"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "registrationDetails" && (
          <motion.div
            key="registrationDetails"
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.fast}
            className="space-y-3"
          >
            <Field>
              <FieldLabel htmlFor="reg-exp">
                Experience (Years) <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="reg-exp"
                placeholder="Enter years of experience (e.g. 8)"
                type="number"
                {...experienceField}
                onChange={(e) => {
                  const value = e.target.value.replace(AUTH_REGEX.nonDigitGlobal, "").slice(0, 2);
                  setValue("experience", value, { shouldValidate: true });
                }}
                className={errors.experience ? "border-red-400 focus-visible:ring-red-300/60 focus-visible:border-red-400" : ""}
              />
              {errors.experience?.message && <FieldError>{String(errors.experience.message)}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="reg-location">
                Service Location <span className="text-red-500">*</span>
              </FieldLabel>
              <select
                id="reg-location"
                value={serviceLocation}
                onChange={(e) => {
                  setValue("serviceLocation", e.target.value, { shouldValidate: true });
                  if (e.target.value) clearErrors("serviceLocation");
                }}
                className={`mt-1 h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition-all focus-visible:ring-2 ${
                  errors.serviceLocation
                    ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-[#FF9933]/50 focus-visible:ring-[#FF9933]/45"
                }`}
              >
                <option value="">Select service location</option>
                {SERVICE_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.serviceLocation?.message && <FieldError>{String(errors.serviceLocation.message)}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>
                Languages Known <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((language) => {
                  const selected = languagesKnown.includes(language);
                  return (
                    <button
                      key={language}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? languagesKnown.filter((item) => item !== language)
                          : [...languagesKnown, language];
                        setValue("languagesKnown", next, { shouldValidate: true });
                        if (next.length > 0) {
                          clearErrors("languagesKnown");
                        } else {
                          setError("languagesKnown", { type: "validate", message: REGISTER_MESSAGES.languageRequiredError });
                        }
                      }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "border-[#FF9933] bg-[#FF9933]/10 text-[#C96F00]"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {language}
                    </button>
                  );
                })}
              </div>
              {errors.languagesKnown?.message && <FieldError>{String(errors.languagesKnown.message)}</FieldError>}
            </Field>

            <p className="text-[11px] leading-relaxed text-slate-500">{REGISTER_MESSAGES.termsText}</p>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("registration")}>
                Back
              </Button>
              <Button onClick={handleRegistrationDetailsContinue} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save and Verify"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "regOtp" && (
          <motion.div
            key="regOtp"
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.fast}
            className="space-y-4"
          >
            <p className="text-xs text-slate-500">
              {REGISTER_MESSAGES.otpSentForRegistrationPrefix}{" "}
              <span className="font-semibold">{mobile}</span>
            </p>
            <OTPInput
              value={otp}
              onChange={(value) => {
                setValue("otp", value, { shouldValidate: true });
                const parsed = otpSchema.safeParse(value);
                if (parsed.success) {
                  clearErrors("otp");
                } else if (value.length > 0) {
                  setError("otp", { type: "validate", message: parsed.error.issues[0]?.message || REGISTER_MESSAGES.errorInvalidOtp });
                }
              }}
              length={6}
              className="justify-center"
              onEnter={handleRegisterOtpSubmit}
            />
            {errors.otp?.message && <FieldError>{String(errors.otp.message)}</FieldError>}

            <div className="text-center text-xs text-slate-500">
              {resendTimer > 0 ? (
                <span>Resend OTP in 00: {String(resendTimer).padStart(2, "0")}</span>
              ) : (
                <button type="button" onClick={handleResendOtp} className="font-semibold text-[#C96F00]">
                  Resend OTP
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("registrationDetails")}>Back</Button>
              <Button onClick={handleRegisterOtpSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Verify & Submit"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RegisterStepProgress({ step }: { step: RegisterStep }) {
  const steps: RegisterStep[] = ["registration", "registrationDetails", "regOtp"];
  const activeIndex = steps.indexOf(step);

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((item, index) => (
        <div key={item} className={`h-1.5 rounded-full ${index <= activeIndex ? "bg-[#FF9933]" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}
