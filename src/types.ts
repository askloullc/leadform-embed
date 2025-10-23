export type LeadFormWidgetConfig = LeadFormConfig & {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  closeButtonLabel?: string
}

export interface LeadFormConfig {
  // payload
  siteSlug: string
  sitePublicKey: string
  // UI
  theme: 'light' | 'dark' | 'auto'
  fields: string[]
  title: string | undefined
  buttonText: string
  successMessage: string
  requireConsent: boolean
  requireMarketingConsent: boolean
  accentColorHex: string
  subtitle?: string | undefined
  nameFieldLabel?: string
  emailFieldLabel?: string
  companyFieldLabel?: string
  phoneFieldLabel?: string
  messageFieldLabel?: string
  nameFieldPlaceholder?: string
  emailFieldPlaceholder?: string
  companyFieldPlaceholder?: string
  phoneFieldPlaceholder?: string
  messageFieldPlaceholder?: string
  successTitle?: string
  successSubtitle?: string
  // non adjustable by clients
  apiEndpoint?: string
}

export interface LeadFormData {
  name?: string
  email?: string
  company?: string
  message?: string
  phone?: string
  consent?: string
  marketingConsent?: string
  [key: string]: string | undefined
}

export interface ConsentEvent {
  timestamp: string
  ip?: string
  userAgent: string
  consentText: string
  consentGiven: boolean
  marketingConsentRequested: boolean
  marketingConsentText: string | undefined
  marketingConsentGiven: boolean | undefined
}

export interface DeviceFingerprint {
  screen: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string | null
}

export interface CaptureLeadPayload {
  siteSlug: string
  sitePublicKey: string
  formData: LeadFormData
  consentEvent: ConsentEvent | null
  deviceFingerprint: DeviceFingerprint
  source: 'embed' | 'react-form'
  submissionTime: number | null
  userAgent: string
  timestamp: string
  url: string
  idempotencyKey: string
}

export const consentText =
  'We value your privacy. By submitting this form, you consent to us storing your details for the purpose of responding to your request.'
export const marketingConsentText =
  'I agree to receive marketing communications relevant to my request. I understand I can unsubscribe at any time.'

export const generateIdempotencyKey = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Email validation function
export function validateEmail(email: string): boolean {
  if (!email || email.trim() === '') {
    return false
  }

  // Basic RFC 5322 compliant email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Phone validation function
export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim() === '') {
    return false
  }

  // Remove all non-digit characters except + for international prefix
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  // Extract digits only for length validation
  const digits = cleanPhone.replace(/[^\d]/g, '')

  // Check length constraints
  if (digits.length < 10 || digits.length > 15) {
    return false
  }

  // Validate different phone number formats
  let isValid = false

  if (digits.length === 10) {
    // US domestic format validation (area code can't start with 0 or 1)
    isValid = /^[2-9]\d{2}[2-9]\d{6}$/.test(digits)
  } else if (digits.length === 11 && digits[0] === '1') {
    // US format with country code
    isValid = /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)
  } else if (digits.length >= 11 && digits.length <= 15) {
    // International format - basic validation
    isValid = /^\d{7,15}$/.test(digits)
  }

  // Additional checks for obviously invalid patterns
  if (isValid) {
    // Check for repeated digits (likely fake numbers like 1111111111)
    if (/^(\d)\1{6,}$/.test(digits)) {
      return false
    }

    // Check for sequential digits (123456789, 987654321, etc.)
    const sequentialPatterns = [
      '012345',
      '123456',
      '234567',
      '345678',
      '456789',
      '567890',
      '654321',
      '543210',
      '432109',
      '321098',
      '210987',
      '109876',
      '098765',
    ]

    for (const pattern of sequentialPatterns) {
      if (digits.includes(pattern)) {
        return false
      }
    }
  }

  return isValid
}
