export const LOGIN_MESSAGES = {
  otpSentPrefix: "OTP sent to",
  toastOtpSent: "OTP sent",
  toastLoginSuccess: "Login successful",
  toastOtpResent: "OTP resent",
  errorInvalidMobile: "Enter valid mobile number",
  errorInvalidOtp: "Enter valid OTP",
} as const;

export const REGISTER_MESSAGES = {
  toastBasicInfoSaved: "Basic info saved",
  toastRegistrationDetailsSaved: "Registration details saved",
  toastRegistrationComplete: "Registration complete",
  toastOtpResent: "OTP resent",
  errorFixHighlightedFields: "Please correct highlighted fields",
  errorCompleteRequiredDetails: "Please complete all required details",
  errorInvalidMobile: "Enter a valid mobile number",
  errorInvalidEmail: "Valid email is required",
  errorInvalidOtp: "Enter valid OTP",
  languageRequiredError: "Select at least one language",
  termsText: "By clicking submit, you accept the Terms and Conditions.",
  otpSentForRegistrationPrefix: "OTP sent for registration confirmation to",
} as const;

export const AUTH_SCHEMA_MESSAGES = {
  mobileInvalid: "Enter a valid 10-digit mobile number",
  otpInvalid: "Enter a valid 6-digit OTP",
  fullNameRequired: "Full name is required",
  emailInvalid: "Valid email is required",
  experienceRequired: "Experience is required",
  languagesRequired: "Select at least one language",
  serviceLocationRequired: "Service location is required",
} as const;
