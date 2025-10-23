import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CaptureLeadPayload,
  ConsentEvent,
  consentText,
  DeviceFingerprint,
  generateIdempotencyKey,
  LeadFormConfig,
  LeadFormData,
  marketingConsentText,
  validateEmail,
  validatePhone,
} from "./types";

// Simplified component props
export interface SimpleLeadFormProps extends Partial<LeadFormConfig> {
  siteSlug: string;
  sitePublicKey: string;
  onSubmit?: (data: { data: LeadFormData; result: any }) => void;
  onError?: (error: { type: string; message: string; error?: any }) => void;
  className?: string;
  style?: React.CSSProperties;
  showSuccessMessage?: boolean;
  dataTestId?: string;
  mockSubmit?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: Omit<LeadFormConfig, "siteSlug" | "sitePublicKey"> = {
  theme: "auto",
  fields: ["name", "email", "message"],
  title: "Get in touch",
  subtitle:
    "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
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
  apiEndpoint: "https://api.loubase.com/v1/leads",
};

/**
 * SimpleLeadForm - A React component that renders a lead capture form directly
 *
 * This is a simplified version that renders the form inline without any modal
 * or floating behavior. The parent component is responsible for showing/hiding.
 *
 * @example
 * ```tsx
 * import { SimpleLeadForm } from '@loubase/leadform-embed/simple'
 *
 * function ContactPage() {
 *   return (
 *     <div className="max-w-md mx-auto">
 *       <SimpleLeadForm
 *         siteId="your-site-id"
 *         title="Contact Us"
 *         fields={['name', 'email', 'message']}
 *         onSubmit={(data) => console.log('Form submitted:', data)}
 *         onError={(error) => console.error('Form error:', error)}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export const SimpleLeadForm: React.FC<SimpleLeadFormProps> = ({
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LeadFormData>({});
  const [showMarketingConsent, setShowMarketingConsent] = useState(false);
  const [submissionStartTime, setSubmissionStartTime] = useState<number | null>(
    null
  );
  const stylesInjectedRef = useRef(false);

  // Merge default config with overrides
  const config: LeadFormConfig = {
    ...DEFAULT_CONFIG,
    siteSlug,
    sitePublicKey,
    ...configOverrides,
  };

  // Inject styles only once
  useEffect(() => {
    if (
      stylesInjectedRef.current ||
      document.getElementById("simple-leadform-styles")
    ) {
      return;
    }

    const style = document.createElement("style");
    style.id = "simple-leadform-styles";
    const accentColor = normalizeColor(config.accentColorHex) || "#3b82f6";

    style.textContent = `
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
    document.head.appendChild(style);
    stylesInjectedRef.current = true;
  }, [config.accentColorHex, config.theme]);

  // Handle form data changes
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }

      // Show marketing consent when valid email is entered
      if (field === "email" && config.requireMarketingConsent) {
        const isValidEmail = validateEmail(value);
        setShowMarketingConsent(isValidEmail);
      }
    },
    [fieldErrors, config.requireMarketingConsent]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isSubmitting) return;

      // Basic validation
      const errors: Record<string, string> = {};
      const fieldMap = getFieldMap(config);

      config.fields.forEach((fieldName) => {
        const field = fieldMap[fieldName];
        if (field?.required && !formData[fieldName]?.trim()) {
          errors[fieldName] = `${field.label} is required`;
        }
      });

      // Check if either email or phone is present when both fields are in the form
      const hasEmailField = config.fields.includes("email");
      const hasPhoneField = config.fields.includes("phone");

      if (hasEmailField && !hasPhoneField) {
        if (!formData.email?.trim()) {
          errors.email = "Email is required";
        } else {
          const isValidEmail = validateEmail(formData.email);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
        }
      }
      if (hasPhoneField && !hasEmailField) {
        if (!formData.phone?.trim()) {
          errors.phone = "Phone is required";
        } else {
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        }
      }
      if (hasEmailField && hasPhoneField) {
        // neither filled
        if (!formData.email?.trim() && !formData.phone?.trim()) {
          errors.email = "Email or phone is required";
          errors.phone = "Email or phone is required";
          // both filled
        } else if (formData.email?.trim() && formData.phone?.trim()) {
          const isValidEmail = validateEmail(formData.email);
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        } else if (formData.phone?.trim()) {
          const isValidPhone = validatePhone(formData.phone);
          if (!isValidPhone) {
            errors.phone = "Please enter a valid phone number";
          }
        } else if (formData.email?.trim()) {
          const isValidEmail = validateEmail(formData.email);
          if (!isValidEmail) {
            errors.email = "Please enter a valid email address";
          }
        }
      }

      // Check consent if required
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

        onSubmit?.({ data: formData, result: response });
      } catch (error) {
        const errorData = {
          type: "submission",
          message: "Failed to submit form. Please try again.",
          error,
        };
        onError?.(errorData);
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
      submissionStartTime,
    ]
  );

  // Render success state
  if (isSuccess && showSuccessMessage) {
    return (
      <div
        className={`simple-leadform ${className}`}
        data-theme={config.theme}
        data-testid={`${dataTestId}-success`}
        style={style}
      >
        <div className="simple-leadform-success">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ margin: "0 auto 16px", color: "#22c55e" }}
            data-testid={`${dataTestId}-success-icon`}
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
          <h3
            style={{ margin: "0 0 8px 0" }}
            data-testid={`${dataTestId}-success-title`}
          >
            {config.successTitle}
          </h3>
          <p
            style={{
              margin: "0",
              color: "var(--leadform-muted-foreground)",
              fontSize: "14px",
            }}
            data-testid={`${dataTestId}-success-subtitle`}
          >
            {config.successSubtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`simple-leadform ${className}`}
      data-theme={config.theme}
      data-testid={dataTestId}
      style={style}
    >
      {(config.title || config.subtitle) && (
        <div
          className="simple-leadform-header"
          data-testid={`${dataTestId}-header`}
        >
          {config.title && (
            <h3
              className="simple-leadform-title"
              data-testid={`${dataTestId}-title`}
            >
              {config.title}
            </h3>
          )}
          {config.subtitle && (
            <p
              className="simple-leadform-subtitle"
              data-testid={`${dataTestId}-subtitle`}
            >
              {config.subtitle}
            </p>
          )}
        </div>
      )}
      <form
        className="simple-leadform-form"
        onSubmit={handleSubmit}
        data-testid={`${dataTestId}-form`}
      >
        {renderFields(
          config,
          formData,
          fieldErrors,
          handleInputChange,
          dataTestId
        )}

        {/* Honeypot field */}
        <div
          className="simple-leadform-field hidden"
          data-testid={`${dataTestId}-honeypot`}
        >
          <label
            className="simple-leadform-label"
            htmlFor="simple-leadform-website"
          >
            Website
          </label>
          <input
            className="simple-leadform-input"
            type="text"
            name="website"
            id="simple-leadform-website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {renderConsentFields(
          config,
          formData,
          fieldErrors,
          handleInputChange,
          showMarketingConsent,
          dataTestId
        )}

        <button
          type="submit"
          className={`simple-leadform-submit ${
            isSubmitting ? "simple-leadform-submit-loading" : ""
          }`}
          disabled={isSubmitting}
          data-testid={`${dataTestId}-submit-button`}
        >
          <span
            className="simple-leadform-submit-text"
            data-testid={`${dataTestId}-submit-text`}
          >
            {config.buttonText}
          </span>
          <div
            className="simple-leadform-spinner"
            style={{ display: isSubmitting ? "block" : "none" }}
            data-testid={`${dataTestId}-submit-spinner`}
          />
        </button>
      </form>
    </div>
  );
};

// Helper functions
function normalizeColor(input?: string): string | null {
  if (!input) return null;
  // Allow only hex colors
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input)) {
    return input;
  }
  return null;
}

function getFieldMap(
  config: LeadFormConfig
): Record<
  string,
  { label: string; type: string; placeholder: string; required: boolean }
> {
  return {
    name: {
      label: config.nameFieldLabel!,
      type: "text",
      placeholder: config.nameFieldPlaceholder!,
      required: true,
    },
    email: {
      label: config.emailFieldLabel!,
      type: "email",
      placeholder: config.emailFieldPlaceholder!,
      required: true,
    },
    company: {
      label: config.companyFieldLabel!,
      type: "text",
      placeholder: config.companyFieldPlaceholder!,
      required: false,
    },
    phone: {
      label: config.phoneFieldLabel!,
      type: "tel",
      placeholder: config.phoneFieldPlaceholder!,
      required: false,
    },
    message: {
      label: config.messageFieldLabel!,
      type: "textarea",
      placeholder: config.messageFieldPlaceholder!,
      required: false,
    },
  };
}

function renderFields(
  config: LeadFormConfig,
  formData: LeadFormData,
  fieldErrors: Record<string, string>,
  handleInputChange: (field: string, value: string) => void,
  dataTestId: string
) {
  const fieldMap = getFieldMap(config);

  return config.fields
    .map((fieldName) => {
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
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => handleInputChange(fieldName, e.target.value),
      };

      return (
        <div
          key={fieldName}
          className="simple-leadform-field"
          data-testid={`${dataTestId}-field-${fieldName}`}
        >
          <label
            className="simple-leadform-label"
            htmlFor={fieldId}
            data-testid={`${dataTestId}-label-${fieldName}`}
          >
            {field.label}
            {field.required ? " *" : ""}
          </label>
          {isTextarea ? (
            <textarea
              {...commonProps}
              className="simple-leadform-input simple-leadform-textarea"
              data-testid={`${dataTestId}-input-${fieldName}`}
            />
          ) : (
            <input
              {...commonProps}
              type={field.type}
              className="simple-leadform-input"
              data-testid={`${dataTestId}-input-${fieldName}`}
            />
          )}
          {error && (
            <div
              className="simple-leadform-error"
              data-testid={`${dataTestId}-error-${fieldName}`}
            >
              {error}
            </div>
          )}
        </div>
      );
    })
    .filter(Boolean);
}

function renderConsentFields(
  config: LeadFormConfig,
  formData: LeadFormData,
  fieldErrors: Record<string, string>,
  handleInputChange: (field: string, value: string) => void,
  showMarketingConsent: boolean,
  dataTestId: string
) {
  const consentFields = [];

  // Required consent
  if (config.requireConsent) {
    const consentError = fieldErrors.consent;
    consentFields.push(
      <div
        key="consent"
        className="simple-leadform-field simple-leadform-checkbox-field"
        data-testid={`${dataTestId}-field-consent`}
      >
        <input
          type="checkbox"
          id="simple-leadform-consent"
          name="consent"
          className="simple-leadform-checkbox"
          required
          checked={formData.consent === "true"}
          onChange={(e) =>
            handleInputChange("consent", e.target.checked ? "true" : "false")
          }
          data-testid={`${dataTestId}-checkbox-consent`}
        />
        <div style={{ flex: 1 }}>
          <label
            htmlFor="simple-leadform-consent"
            className="simple-leadform-checkbox-label"
            data-testid={`${dataTestId}-label-consent`}
          >
            {consentText}
          </label>
          {consentError && (
            <div
              className="simple-leadform-error"
              data-testid={`${dataTestId}-error-consent`}
            >
              {consentError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Marketing consent
  if (config.requireMarketingConsent && showMarketingConsent) {
    consentFields.push(
      <div
        key="marketing-consent"
        className="simple-leadform-field simple-leadform-checkbox-field"
        data-testid={`${dataTestId}-field-marketing-consent`}
      >
        <input
          type="checkbox"
          id="simple-leadform-marketing-consent"
          name="marketingConsent"
          className="simple-leadform-checkbox"
          checked={formData.marketingConsent === "true"}
          onChange={(e) =>
            handleInputChange(
              "marketingConsent",
              e.target.checked ? "true" : "false"
            )
          }
          data-testid={`${dataTestId}-checkbox-marketing-consent`}
        />
        <label
          htmlFor="simple-leadform-marketing-consent"
          className="simple-leadform-checkbox-label"
          data-testid={`${dataTestId}-label-marketing-consent`}
        >
          {marketingConsentText}
        </label>
      </div>
    );
  }

  return consentFields;
}

function generateDeviceFingerprint(): DeviceFingerprint {
  if (typeof window === "undefined") {
    return {
      screen: "",
      timezone: "",
      language: "",
      platform: "",
      cookieEnabled: false,
      doNotTrack: null,
    };
  }

  return {
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    language: navigator.language || "",
    platform: navigator.platform || "",
    cookieEnabled: navigator.cookieEnabled || false,
    doNotTrack: navigator.doNotTrack,
  };
}

async function getClientIP(): Promise<string | undefined> {
  try {
    // Try to get IP from a public service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // Fallback: try another service
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return data.ip;
    } catch (fallbackError) {
      console.warn("Could not determine client IP address");
      return undefined;
    }
  }
}

async function generateConsentEvent(
  formData: LeadFormData,
  config: LeadFormConfig
): Promise<ConsentEvent | null> {
  if (!config.requireConsent && !config.requireMarketingConsent) {
    return null;
  }

  const ip = await getClientIP();

  return {
    timestamp: new Date().toISOString(),
    consentGiven: true,
    marketingConsentRequested: config.requireMarketingConsent,
    marketingConsentText: marketingConsentText,
    marketingConsentGiven: formData.marketingConsent === "true",
    consentText: consentText,
    ip: ip,
    userAgent: navigator.userAgent || "",
  };
}

async function submitFormData(
  config: LeadFormConfig,
  formData: LeadFormData,
  submissionStartTime: number | null,
  mockSubmit: boolean
) {
  const apiEndpoint = config.apiEndpoint || "https://api.loubase.com/v1/leads";

  // Calculate submission time if available
  const submissionTime = submissionStartTime
    ? Date.now() - submissionStartTime
    : null;

  const idempotencyKey = generateIdempotencyKey();
  // Prepare submission data
  const submissionData: CaptureLeadPayload = {
    siteSlug: config.siteSlug,
    sitePublicKey: config.sitePublicKey,
    formData,
    consentEvent: await generateConsentEvent(formData, config),
    deviceFingerprint: generateDeviceFingerprint(),
    source: "react-form",
    timestamp: new Date().toISOString(),
    submissionTime,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    idempotencyKey,
  };

  if (mockSubmit) {
    return {
      success: true,
      message: "Form submitted successfully",
    };
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    // Log error for debugging
    console.error("Lead form submission error:", error);
    throw error;
  }
}

// Types are exported from the main export statement above
