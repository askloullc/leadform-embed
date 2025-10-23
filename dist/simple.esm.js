// src/simple-form.tsx
import { useCallback, useEffect, useRef, useState } from "react";

// src/types.ts
var consentText = "We value your privacy. By submitting this form, you consent to us storing your details for the purpose of responding to your request.";
var marketingConsentText = "I agree to receive marketing communications relevant to my request. I understand I can unsubscribe at any time.";
var generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
function validateEmail(email) {
  if (!email || email.trim() === "") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
function validatePhone(phone) {
  if (!phone || phone.trim() === "") {
    return false;
  }
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const digits = cleanPhone.replace(/[^\d]/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return false;
  }
  let isValid = false;
  if (digits.length === 10) {
    isValid = /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
  } else if (digits.length === 11 && digits[0] === "1") {
    isValid = /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits);
  } else if (digits.length >= 11 && digits.length <= 15) {
    isValid = /^\d{7,15}$/.test(digits);
  }
  if (isValid) {
    if (/^(\d)\1{6,}$/.test(digits)) {
      return false;
    }
    const sequentialPatterns = [
      "012345",
      "123456",
      "234567",
      "345678",
      "456789",
      "567890",
      "654321",
      "543210",
      "432109",
      "321098",
      "210987",
      "109876",
      "098765"
    ];
    for (const pattern of sequentialPatterns) {
      if (digits.includes(pattern)) {
        return false;
      }
    }
  }
  return isValid;
}

// src/simple-form.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_CONFIG = {
  theme: "auto",
  fields: ["name", "email", "message"],
  title: "Get in touch",
  subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  buttonText: "Send message",
  successMessage: "Thank you! We'll get back to you soon.",
  requireConsent: true,
  requireMarketingConsent: false,
  accentColorHex: "#3b82f6",
  nameFieldLabel: "Name",
  emailFieldLabel: "Email",
  companyFieldLabel: "Company",
  phoneFieldLabel: "Phone",
  messageFieldLabel: "Message",
  nameFieldPlaceholder: "Your name",
  emailFieldPlaceholder: "your@email.com",
  companyFieldPlaceholder: "Your company",
  phoneFieldPlaceholder: "Your phone number",
  messageFieldPlaceholder: "Your message...",
  successTitle: "Thank you!",
  successSubtitle: "We'll get back to you as soon as possible.",
  apiEndpoint: "https://api.loubase.com/v1/leads"
};
var SimpleLeadForm = ({
  siteSlug,
  sitePublicKey,
  onSubmit,
  onError,
  className = "",
  style,
  showSuccessMessage = true,
  dataTestId = "simple-leadform",
  mockSubmit = false,
  ...configOverrides
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [showMarketingConsent, setShowMarketingConsent] = useState(false);
  const [submissionStartTime, setSubmissionStartTime] = useState(
    null
  );
  const stylesInjectedRef = useRef(false);
  const config = {
    ...DEFAULT_CONFIG,
    siteSlug,
    sitePublicKey,
    ...configOverrides
  };
  useEffect(() => {
    if (stylesInjectedRef.current || document.getElementById("simple-leadform-styles")) {
      return;
    }
    const style2 = document.createElement("style");
    style2.id = "simple-leadform-styles";
    const accentColor = normalizeColor(config.accentColorHex) || "#3b82f6";
    style2.textContent = `
      .simple-leadform {
        --leadform-primary: ${accentColor};
        --leadform-primary-foreground: #ffffff;
        --leadform-background: #ffffff;
        --leadform-foreground: #0f172a;
        --leadform-muted: #f8fafc;
        --leadform-muted-foreground: #64748b;
        --leadform-border: #e2e8f0;
        --leadform-input: #ffffff;
        --leadform-ring: var(--leadform-primary);
        --leadform-destructive: #ef4444;
        --leadform-destructive-foreground: #ffffff;
        
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: var(--leadform-foreground);
        box-sizing: border-box;
        background: var(--leadform-background);
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        padding: 24px;
        max-width: 100%;
      }

      @media (prefers-color-scheme: dark) {
        .simple-leadform[data-theme="auto"] {
          --leadform-background: #0f172a;
          --leadform-foreground: #f8fafc;
          --leadform-muted: #1e293b;
          --leadform-muted-foreground: #94a3b8;
          --leadform-border: #334155;
          --leadform-input: #1e293b;
        }
      }

      .simple-leadform[data-theme="dark"] {
        --leadform-background: #0f172a;
        --leadform-foreground: #f8fafc;
        --leadform-muted: #1e293b;
        --leadform-muted-foreground: #94a3b8;
        --leadform-border: #334155;
        --leadform-input: #1e293b;
      }

      .simple-leadform * {
        box-sizing: border-box;
      }

      .simple-leadform-header {
        margin-bottom: 24px;
        text-align: left;
      }

      .simple-leadform-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: var(--leadform-foreground);
      }

      .simple-leadform-subtitle {
        font-size: 14px;
        color: var(--leadform-muted-foreground);
        margin: 0;
        line-height: 1.4;
      }

      .simple-leadform-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .simple-leadform-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .simple-leadform-field.hidden {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }

      .simple-leadform-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--leadform-foreground);
      }

      .simple-leadform-input {
        padding: 12px 16px;
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        background: var(--leadform-input);
        color: var(--leadform-foreground);
        font-size: 14px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .simple-leadform-input:focus {
        outline: none;
        border-color: var(--leadform-ring);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .simple-leadform-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .simple-leadform-checkbox-field {
        flex-direction: row;
        align-items: flex-start;
        gap: 12px;
      }

      .simple-leadform-checkbox {
        margin-top: 2px;
        width: 16px;
        height: 16px;
      }

      .simple-leadform-checkbox-label {
        font-size: 12px;
        color: var(--leadform-muted-foreground);
        line-height: 1.4;
      }

      .simple-leadform-submit {
        background: var(--leadform-primary);
        color: var(--leadform-primary-foreground);
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        position: relative;
        margin-top: 8px;
      }

      .simple-leadform-submit:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      .simple-leadform-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .simple-leadform-submit-loading {
        color: transparent;
      }

      .simple-leadform-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid var(--leadform-primary-foreground);
        border-radius: 50%;
        animation: simple-leadform-spin 1s linear infinite;
      }

      @keyframes simple-leadform-spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .simple-leadform-success {
        text-align: center;
        padding: 20px;
        color: var(--leadform-foreground);
      }

      .simple-leadform-error {
        color: var(--leadform-destructive);
        font-size: 12px;
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style2);
    stylesInjectedRef.current = true;
  }, [config.accentColorHex, config.theme]);
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }
      if (field === "email" && config.requireMarketingConsent) {
        const isValidEmail = validateEmail(value);
        setShowMarketingConsent(isValidEmail);
      }
    },
    [fieldErrors, config.requireMarketingConsent]
  );
  const handleSubmit = useCallback(
    async (e) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      e.preventDefault();
      if (isSubmitting) return;
      const errors = {};
      const fieldMap = getFieldMap(config);
      config.fields.forEach((fieldName) => {
        var _a2;
        const field = fieldMap[fieldName];
        if ((field == null ? void 0 : field.required) && !((_a2 = formData[fieldName]) == null ? void 0 : _a2.trim())) {
          errors[fieldName] = `${field.label} is required`;
        }
      });
      const hasEmailField = config.fields.includes("email");
      const hasPhoneField = config.fields.includes("phone");
      if (hasEmailField && !hasPhoneField) {
        if (!((_a = formData.email) == null ? void 0 : _a.trim())) {
          errors.email = "Email is required";
        } else {
          const isValidEmail = validateEmail(formData.email);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
        }
      }
      if (hasPhoneField && !hasEmailField) {
        if (!((_b = formData.phone) == null ? void 0 : _b.trim())) {
          errors.phone = "Phone is required";
        } else {
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        }
      }
      if (hasEmailField && hasPhoneField) {
        if (!((_c = formData.email) == null ? void 0 : _c.trim()) && !((_d = formData.phone) == null ? void 0 : _d.trim())) {
          errors.email = "Email or phone is required";
          errors.phone = "Email or phone is required";
        } else if (((_e = formData.email) == null ? void 0 : _e.trim()) && ((_f = formData.phone) == null ? void 0 : _f.trim())) {
          const isValidEmail = validateEmail(formData.email);
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        } else if ((_g = formData.phone) == null ? void 0 : _g.trim()) {
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        } else if ((_h = formData.email) == null ? void 0 : _h.trim()) {
          const isValidEmail = validateEmail(formData.email);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
        }
      }
      if (config.requireConsent && formData.consent !== "true") {
        errors.consent = "Consent is required";
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setIsSubmitting(true);
      setFieldErrors({});
      setSubmissionStartTime(Date.now());
      try {
        const response = await submitFormData(
          config,
          formData,
          submissionStartTime,
          mockSubmit
        );
        if (showSuccessMessage) {
          setIsSuccess(true);
        }
        onSubmit == null ? void 0 : onSubmit({ data: formData, result: response });
      } catch (error) {
        const errorData = {
          type: "submission",
          message: "Failed to submit form. Please try again.",
          error
        };
        onError == null ? void 0 : onError(errorData);
      } finally {
        setIsSubmitting(false);
        setSubmissionStartTime(null);
      }
    },
    [
      config,
      formData,
      isSubmitting,
      onSubmit,
      onError,
      showSuccessMessage,
      submissionStartTime
    ]
  );
  if (isSuccess && showSuccessMessage) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `simple-leadform ${className}`,
        "data-theme": config.theme,
        "data-testid": `${dataTestId}-success`,
        style,
        children: /* @__PURE__ */ jsxs("div", { className: "simple-leadform-success", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              width: "48",
              height: "48",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              style: { margin: "0 auto 16px", color: "#22c55e" },
              "data-testid": `${dataTestId}-success-icon`,
              children: [
                /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                /* @__PURE__ */ jsx("polyline", { points: "22,4 12,14.01 9,11.01" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "h3",
            {
              style: { margin: "0 0 8px 0" },
              "data-testid": `${dataTestId}-success-title`,
              children: config.successTitle
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                margin: "0",
                color: "var(--leadform-muted-foreground)",
                fontSize: "14px"
              },
              "data-testid": `${dataTestId}-success-subtitle`,
              children: config.successSubtitle
            }
          )
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `simple-leadform ${className}`,
      "data-theme": config.theme,
      "data-testid": dataTestId,
      style,
      children: [
        (config.title || config.subtitle) && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "simple-leadform-header",
            "data-testid": `${dataTestId}-header`,
            children: [
              config.title && /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "simple-leadform-title",
                  "data-testid": `${dataTestId}-title`,
                  children: config.title
                }
              ),
              config.subtitle && /* @__PURE__ */ jsx(
                "p",
                {
                  className: "simple-leadform-subtitle",
                  "data-testid": `${dataTestId}-subtitle`,
                  children: config.subtitle
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "form",
          {
            className: "simple-leadform-form",
            onSubmit: handleSubmit,
            "data-testid": `${dataTestId}-form`,
            children: [
              renderFields(
                config,
                formData,
                fieldErrors,
                handleInputChange,
                dataTestId
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "simple-leadform-field hidden",
                  "data-testid": `${dataTestId}-honeypot`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        className: "simple-leadform-label",
                        htmlFor: "simple-leadform-website",
                        children: "Website"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        className: "simple-leadform-input",
                        type: "text",
                        name: "website",
                        id: "simple-leadform-website",
                        tabIndex: -1,
                        autoComplete: "off"
                      }
                    )
                  ]
                }
              ),
              renderConsentFields(
                config,
                formData,
                fieldErrors,
                handleInputChange,
                showMarketingConsent,
                dataTestId
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  className: `simple-leadform-submit ${isSubmitting ? "simple-leadform-submit-loading" : ""}`,
                  disabled: isSubmitting,
                  "data-testid": `${dataTestId}-submit-button`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "simple-leadform-submit-text",
                        "data-testid": `${dataTestId}-submit-text`,
                        children: config.buttonText
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "simple-leadform-spinner",
                        style: { display: isSubmitting ? "block" : "none" },
                        "data-testid": `${dataTestId}-submit-spinner`
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
function normalizeColor(input) {
  if (!input) return null;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input)) {
    return input;
  }
  return null;
}
function getFieldMap(config) {
  return {
    name: {
      label: config.nameFieldLabel,
      type: "text",
      placeholder: config.nameFieldPlaceholder,
      required: true
    },
    email: {
      label: config.emailFieldLabel,
      type: "email",
      placeholder: config.emailFieldPlaceholder,
      required: true
    },
    company: {
      label: config.companyFieldLabel,
      type: "text",
      placeholder: config.companyFieldPlaceholder,
      required: false
    },
    phone: {
      label: config.phoneFieldLabel,
      type: "tel",
      placeholder: config.phoneFieldPlaceholder,
      required: false
    },
    message: {
      label: config.messageFieldLabel,
      type: "textarea",
      placeholder: config.messageFieldPlaceholder,
      required: false
    }
  };
}
function renderFields(config, formData, fieldErrors, handleInputChange, dataTestId) {
  const fieldMap = getFieldMap(config);
  return config.fields.map((fieldName) => {
    const field = fieldMap[fieldName];
    if (!field) return null;
    const isTextarea = field.type === "textarea";
    const fieldId = `simple-leadform-${fieldName}`;
    const value = formData[fieldName] || "";
    const error = fieldErrors[fieldName];
    const commonProps = {
      name: fieldName,
      id: fieldId,
      placeholder: field.placeholder,
      required: field.required,
      value,
      onChange: (e) => handleInputChange(fieldName, e.target.value)
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "simple-leadform-field",
        "data-testid": `${dataTestId}-field-${fieldName}`,
        children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: "simple-leadform-label",
              htmlFor: fieldId,
              "data-testid": `${dataTestId}-label-${fieldName}`,
              children: [
                field.label,
                field.required ? " *" : ""
              ]
            }
          ),
          isTextarea ? /* @__PURE__ */ jsx(
            "textarea",
            {
              ...commonProps,
              className: "simple-leadform-input simple-leadform-textarea",
              "data-testid": `${dataTestId}-input-${fieldName}`
            }
          ) : /* @__PURE__ */ jsx(
            "input",
            {
              ...commonProps,
              type: field.type,
              className: "simple-leadform-input",
              "data-testid": `${dataTestId}-input-${fieldName}`
            }
          ),
          error && /* @__PURE__ */ jsx(
            "div",
            {
              className: "simple-leadform-error",
              "data-testid": `${dataTestId}-error-${fieldName}`,
              children: error
            }
          )
        ]
      },
      fieldName
    );
  }).filter(Boolean);
}
function renderConsentFields(config, formData, fieldErrors, handleInputChange, showMarketingConsent, dataTestId) {
  const consentFields = [];
  if (config.requireConsent) {
    const consentError = fieldErrors.consent;
    consentFields.push(
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "simple-leadform-field simple-leadform-checkbox-field",
          "data-testid": `${dataTestId}-field-consent`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "simple-leadform-consent",
                name: "consent",
                className: "simple-leadform-checkbox",
                required: true,
                checked: formData.consent === "true",
                onChange: (e) => handleInputChange("consent", e.target.checked ? "true" : "false"),
                "data-testid": `${dataTestId}-checkbox-consent`
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "simple-leadform-consent",
                  className: "simple-leadform-checkbox-label",
                  "data-testid": `${dataTestId}-label-consent`,
                  children: consentText
                }
              ),
              consentError && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "simple-leadform-error",
                  "data-testid": `${dataTestId}-error-consent`,
                  children: consentError
                }
              )
            ] })
          ]
        },
        "consent"
      )
    );
  }
  if (config.requireMarketingConsent && showMarketingConsent) {
    consentFields.push(
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "simple-leadform-field simple-leadform-checkbox-field",
          "data-testid": `${dataTestId}-field-marketing-consent`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "simple-leadform-marketing-consent",
                name: "marketingConsent",
                className: "simple-leadform-checkbox",
                checked: formData.marketingConsent === "true",
                onChange: (e) => handleInputChange(
                  "marketingConsent",
                  e.target.checked ? "true" : "false"
                ),
                "data-testid": `${dataTestId}-checkbox-marketing-consent`
              }
            ),
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "simple-leadform-marketing-consent",
                className: "simple-leadform-checkbox-label",
                "data-testid": `${dataTestId}-label-marketing-consent`,
                children: marketingConsentText
              }
            )
          ]
        },
        "marketing-consent"
      )
    );
  }
  return consentFields;
}
function generateDeviceFingerprint() {
  if (typeof window === "undefined") {
    return {
      screen: "",
      timezone: "",
      language: "",
      platform: "",
      cookieEnabled: false,
      doNotTrack: null
    };
  }
  return {
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    language: navigator.language || "",
    platform: navigator.platform || "",
    cookieEnabled: navigator.cookieEnabled || false,
    doNotTrack: navigator.doNotTrack
  };
}
async function getClientIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return data.ip;
    } catch (fallbackError) {
      console.warn("Could not determine client IP address");
      return void 0;
    }
  }
}
async function generateConsentEvent(formData, config) {
  if (!config.requireConsent && !config.requireMarketingConsent) {
    return null;
  }
  const ip = await getClientIP();
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    consentGiven: true,
    marketingConsentRequested: config.requireMarketingConsent,
    marketingConsentText,
    marketingConsentGiven: formData.marketingConsent === "true",
    consentText,
    ip,
    userAgent: navigator.userAgent || ""
  };
}
async function submitFormData(config, formData, submissionStartTime, mockSubmit) {
  const apiEndpoint = config.apiEndpoint || "https://api.loubase.com/v1/leads";
  const submissionTime = submissionStartTime ? Date.now() - submissionStartTime : null;
  const idempotencyKey = generateIdempotencyKey();
  const submissionData = {
    siteSlug: config.siteSlug,
    sitePublicKey: config.sitePublicKey,
    formData,
    consentEvent: await generateConsentEvent(formData, config),
    deviceFingerprint: generateDeviceFingerprint(),
    source: "react-form",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    submissionTime,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    idempotencyKey
  };
  if (mockSubmit) {
    return {
      success: true,
      message: "Form submitted successfully"
    };
  }
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify(submissionData)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lead form submission error:", error);
    throw error;
  }
}
export {
  SimpleLeadForm
};
//# sourceMappingURL=simple.esm.js.map