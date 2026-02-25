import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/components/auth/OTPInput";

type AuthStep = "mobile" | "otp" | "registration" | "kyc";

export function Login({
  onLogin,
}: {
  onLogin: (userData: { name: string; profile: string; mobile: string; email: string }) => void;
}) {
  const [step, setStep] = React.useState<AuthStep>("mobile");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [serviceLocations, setServiceLocations] = React.useState("");
  const [aadhaarName, setAadhaarName] = React.useState("");
  const [profilePhotoName, setProfilePhotoName] = React.useState("");
  const [kycDocName, setKycDocName] = React.useState("");

  useSetShell({
    title: null,
    footer: null,
    bottomNav: null,
  });

  const validateMobile = () => /^[6-9]\d{9}$/.test(mobile);
  const validateOtp = () => /^\d{6}$/.test(otp);
  const validateRegistration = () => {
    if (!fullName.trim()) return "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Valid email is required";
    if (!experience || Number(experience) < 0) return "Experience is required";
    if (!languages.trim()) return "Languages are required";
    if (!serviceLocations.trim()) return "Service location is required";
    if (!aadhaarName) return "Aadhaar upload is required";
    if (!profilePhotoName) return "Profile photo upload is required";
    return "";
  };

  const handleSendOtp = () => {
    setError("");
    if (!validateMobile()) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setError("");
    if (!validateOtp()) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("registration");
    }, 1000);
  };

  const handleRegistrationContinue = () => {
    setError("");
    const validationError = validateRegistration();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("kyc");
    }, 1000);
  };

  const handleKycSubmit = () => {
    setError("");
    if (!kycDocName) {
      setError("KYC document is required for verification");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: fullName,
        profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + mobile,
        mobile,
        email,
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleAutoFillRegistration = () => {
    setFullName("Pandit Vishwanath Sharma");
    setEmail("vishwanath@yajro.in");
    setExperience("12");
    setLanguages("Telugu, Hindi, English, Sanskrit");
    setServiceLocations("Hyderabad 500081, Secunderabad 500003");
    setAadhaarName("aadhaar_vishwanath.pdf");
    setProfilePhotoName("vishwanath_profile.jpg");
    setKycDocName("kyc_certificate.pdf");
    setMobile((prev) => prev || "9876543210");
    setOtp((prev) => prev || "123456");
    setError("");
  };

  const handleQuickLogin = () => {
    onLogin({
      name: "Pandit Vishwanath Sharma",
      profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=9876543210",
      mobile: "9876543210",
      email: "vishwanath@yajro.in",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-4">
      <div className="text-center mb-6 w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FF9933] to-amber-500 shadow-xl shadow-orange-200 mb-4">
          <img src="/images/yajro-logo.png" alt="Yajro Logo" />
        </div>
        <h1 className="text-2xl font-bold text-slate-700 tracking-tight">Yajro Priests - Partner App</h1>
        <p className="text-slate-500 mt-2 font-medium">Register, verify, manage pooja bookings and earnings</p>
      </div>

      <Card className="p-6 border-slate-100 shadow-xl shadow-slate-200/50 w-full max-w-sm space-y-3">
        <StepProgress step={step} />

        {step === "mobile" && (
          <div className="space-y-3">
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
            <Button className="w-full" onClick={handleSendOtp} disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleQuickLogin}>
              Quick Partner Login (Temp)
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">OTP sent to +91 {mobile}</p>
            <OTPInput value={otp} onChange={setOtp} length={6} className="justify-center" onEnter={handleVerifyOtp} />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("mobile")}>Back</Button>
              <Button onClick={handleVerifyOtp} disabled={isLoading || otp.length < 6}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </div>
        )}

        {step === "registration" && (
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleAutoFillRegistration}>
              Auto Fill Test Data (Temp)
            </Button>
            <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Experience (Years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
            <Input placeholder="Languages Known (comma separated)" value={languages} onChange={(e) => setLanguages(e.target.value)} />
            <Input placeholder="Service Locations (City / Pincode)" value={serviceLocations} onChange={(e) => setServiceLocations(e.target.value)} />
            <Input placeholder="Aadhaar Upload (filename)" value={aadhaarName} onChange={(e) => setAadhaarName(e.target.value)} />
            <Input placeholder="Profile Photo Upload (filename)" value={profilePhotoName} onChange={(e) => setProfilePhotoName(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("otp")}>Back</Button>
              <Button onClick={handleRegistrationContinue} disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue to KYC"}
              </Button>
            </div>
          </div>
        )}

        {step === "kyc" && (
          <div className="space-y-3">
            <Input placeholder="KYC Upload (document filename)" value={kycDocName} onChange={(e) => setKycDocName(e.target.value)} />
            <p className="text-xs text-slate-500">Verification usually completes in 24-48 hours.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setStep("registration")}>Back</Button>
              <Button onClick={handleKycSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit & Login"}
              </Button>
            </div>
          </div>
        )}

        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      </Card>
    </div>
  );
}

function StepProgress({ step }: { step: AuthStep }) {
  const steps: AuthStep[] = ["mobile", "otp", "registration", "kyc"];
  const activeIndex = steps.indexOf(step);

  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((item, index) => (
        <div key={item} className={`h-1.5 rounded-full ${index <= activeIndex ? "bg-[#FF9933]" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}
