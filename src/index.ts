/**
 * LeadForm Embeddable Widget
 * A simple floating lead capture form that can be embedded on any website
 */

import {
  CaptureLeadPayload,
  ConsentEvent,
  DeviceFingerprint,
  LeadFormData,
  LeadFormWidgetConfig,
  consentText,
  generateIdempotencyKey,
  marketingConsentText,
  validateEmail,
  validatePhone,
} from './types'
export type EventType = 'open' | 'close' | 'submit' | 'error'

class LeadFormWidget {
  private config: LeadFormWidgetConfig
  private container: HTMLDivElement
  private isVisible: boolean = false
  private isSubmitting: boolean = false
  private formStartTime: number = 0
  private idempotencyKey: string = ''
  private deviceFingerprint: DeviceFingerprint
  private eventListeners: Map<EventType, Set<Function>> = new Map()
  private consentText: string
  private marketingConsentText: string

  constructor(config: LeadFormWidgetConfig) {
    this.config = this.validateConfig(config)
    this.container = document.createElement('div')
    this.deviceFingerprint = this.generateDeviceFingerprint()
    this.validateOrigin()
    this.init()
    document.addEventListener('keydown', this.onKeydown)
    this.consentText = consentText
    this.marketingConsentText = marketingConsentText
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isVisible) {
      this.hide()
    }
  }

  private validateConfig(config: LeadFormWidgetConfig): LeadFormWidgetConfig {
    if (!config.siteSlug) {
      throw new Error('LeadForm: siteSlug is required')
    }
    if (!config.sitePublicKey) {
      throw new Error('LeadForm: sitePublicKey is required')
    }

    return {
      ...config,
      // Set defaults for configurable text
      subtitle:
        config.subtitle ||
        "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      closeButtonLabel: config.closeButtonLabel || 'Close',
      nameFieldLabel: config.nameFieldLabel || 'Name',
      emailFieldLabel: config.emailFieldLabel || 'Email',
      companyFieldLabel: config.companyFieldLabel || 'Company',
      phoneFieldLabel: config.phoneFieldLabel || 'Phone',
      messageFieldLabel: config.messageFieldLabel || 'Message',
      nameFieldPlaceholder: config.nameFieldPlaceholder || 'Your name',
      emailFieldPlaceholder:
        config.emailFieldPlaceholder || 'your.email@example.com',
      companyFieldPlaceholder: config.companyFieldPlaceholder || 'Your company',
      phoneFieldPlaceholder: config.phoneFieldPlaceholder || '(555) 123-4567',
      messageFieldPlaceholder:
        config.messageFieldPlaceholder || 'Tell us about your project...',
      successTitle: config.successTitle || config.successMessage || 'Success',
      successSubtitle: config.successSubtitle || "We'll get back to you soon!",
    }
  }

  private validateOrigin(): void {
    const origin = window.location.origin
    const protocol = window.location.protocol

    if (
      protocol !== 'https:' &&
      protocol !== 'http:' &&
      origin !== 'http://localhost:3000'
    ) {
      console.warn('LeadForm: HTTPS is required for production use')
    }
  }

  private generateDeviceFingerprint(): DeviceFingerprint {
    return {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
    }
  }

  private emit(event: EventType, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error)
        }
      })
    }
  }

  public on(event: EventType, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  public off(event: EventType, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  private init(): void {
    this.injectStyles()
    this.createForm()
    this.createFloatingTrigger()
    this.attachEventListeners()

    document.body.appendChild(this.container)
  }

  private injectStyles(): void {
    // Check if styles are already injected
    if (document.getElementById('leadform-widget-styles')) {
      return
    }

    const style = document.createElement('style')
    style.id = 'leadform-widget-styles'
    const accentColor =
      this.normalizeColor(this.config.accentColorHex) || '#3b82f6'

    style.textContent = `
      .leadform-widget {
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
      }

      @media (prefers-color-scheme: dark) {
        .leadform-widget[data-theme="auto"] {
          --leadform-background: #0f172a;
          --leadform-foreground: #f8fafc;
          --leadform-muted: #1e293b;
          --leadform-muted-foreground: #94a3b8;
          --leadform-border: #334155;
          --leadform-input: #1e293b;
        }
      }

      .leadform-widget[data-theme="dark"] {
        --leadform-background: #0f172a;
        --leadform-foreground: #f8fafc;
        --leadform-muted: #1e293b;
        --leadform-muted-foreground: #94a3b8;
        --leadform-border: #334155;
        --leadform-input: #1e293b;
      }

      .leadform-widget * {
        box-sizing: border-box;
      }

      .leadform-container {
        position: fixed;
        z-index: 999999;
        background: var(--leadform-background);
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 24px;
        width: 320px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        overflow-y: auto;
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        visibility: hidden;
      }

      .leadform-container.visible {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
      }

      .leadform-container.bottom-right {
        bottom: 16px;
        right: 16px;
      }

      .leadform-container.bottom-left {
        bottom: 16px;
        left: 16px;
      }

      .leadform-container.top-right {
        top: 16px;
        right: 16px;
        transform: translateY(-100%);
      }

      .leadform-container.top-right.visible {
        transform: translateY(0);
      }

      .leadform-container.top-left {
        top: 16px;
        left: 16px;
        transform: translateY(-100%);
      }

      .leadform-container.top-left.visible {
        transform: translateY(0);
      }

      .leadform-container.center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
      }

      .leadform-container.center.visible {
        transform: translate(-50%, -50%) scale(1);
      }

      .leadform-trigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--leadform-primary);
        color: var(--leadform-primary-foreground);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 999998;
      }

      .leadform-trigger:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .leadform-header {
        margin-bottom: 24px;
        text-align: left;
      }

      .leadform-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: var(--leadform-foreground);
      }

      .leadform-subtitle {
        font-size: 14px;
        color: var(--leadform-muted-foreground);
        margin: 0;
        line-height: 1.4;
      }

      .leadform-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        color: var(--leadform-muted-foreground);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s ease;
      }

      .leadform-close:hover {
        color: var(--leadform-foreground);
      }

      .leadform-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .leadform-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .leadform-field.hidden {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }

      .leadform-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--leadform-foreground);
      }

      .leadform-input {
        padding: 12px 16px;
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        background: var(--leadform-input);
        color: var(--leadform-foreground);
        font-size: 14px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .leadform-input:focus {
        outline: none;
        border-color: var(--leadform-ring);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .leadform-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .leadform-checkbox-field {
        flex-direction: row;
        align-items: flex-start;
        gap: 12px;
      }

      .leadform-checkbox {
        margin-top: 2px;
        width: 16px;
        height: 16px;
      }

      .leadform-checkbox-label {
        font-size: 12px;
        color: var(--leadform-muted-foreground);
        line-height: 1.4;
      }

      .leadform-submit {
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

      .leadform-submit:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      .leadform-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .leadform-submit-loading {
        color: transparent;
      }

      .leadform-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid var(--leadform-primary-foreground);
        border-radius: 50%;
        animation: leadform-spin 1s linear infinite;
      }

      @keyframes leadform-spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .leadform-success {
        text-align: center;
        padding: 20px;
        color: var(--leadform-foreground);
      }

      .leadform-error {
        color: var(--leadform-destructive);
        font-size: 12px;
        margin-top: 4px;
      }

      @media (max-width: 480px) {
        .leadform-container {
          width: calc(100vw - 32px);
          margin: 16px;
        }
        
        .leadform-container.bottom-right,
        .leadform-container.bottom-left {
          bottom: 0;
          left: 16px;
          right: 16px;
          width: auto;
        }
      }
    `
    document.head.appendChild(style)
  }

  private normalizeColor(input?: string): string | null {
    if (!input) return null
    // Allow only hex colors (#rgb, #rrggbb, #rrggbbaa)
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input)) {
      return input
    }
    // Use the browser to validate/normalize
    const el = document.createElement('div')
    el.style.color = ''
    el.style.color = input
    return el.style.color ? getComputedStyle(el).color : null
  }

  private createForm(): void {
    this.formStartTime = Date.now()
    this.idempotencyKey = generateIdempotencyKey()

    this.container.className = 'leadform-widget'
    this.container.setAttribute('data-theme', this.config.theme)

    const formContainer = document.createElement('div')
    formContainer.className = `leadform-container ${this.config.position}`

    const honeypotField = `
      <div class="leadform-field hidden">
        <label class="leadform-label" for="leadform-website">Website</label>
        <input class="leadform-input" type="text" name="website" id="leadform-website" tabindex="-1" autocomplete="off">
      </div>
    `

    const consentFields = this.generateConsentFields()

    formContainer.innerHTML = `
      <button class="leadform-close" type="button" aria-label="${this.config.closeButtonLabel}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="leadform-header">
        <h3 class="leadform-title">${this.config.title}</h3>
        <p class="leadform-subtitle">${this.config.subtitle}</p>
      </div>
      <form class="leadform-form">
        ${this.generateFields()}
        ${honeypotField}
        ${consentFields}
        <button type="submit" class="leadform-submit">
          <span class="leadform-submit-text">${this.config.buttonText}</span>
          <div class="leadform-spinner" style="display: none;"></div>
        </button>
      </form>
    `

    this.container.appendChild(formContainer)
  }

  private generateConsentFields(): string {
    let consentFields = ''

    // Required consent (privacy/data handling)
    if (this.config.requireConsent) {
      consentFields += `
        <div class="leadform-field leadform-checkbox-field">
          <input type="checkbox" id="leadform-consent" name="consent" class="leadform-checkbox" required>
          <label for="leadform-consent" class="leadform-checkbox-label">
            ${this.consentText}
          </label>
        </div>
      `
    }

    // Marketing consent (optional)
    if (this.config.requireMarketingConsent) {
      consentFields += `
        <div class="leadform-field leadform-checkbox-field" id="leadform-marketing-consent-field" style="display: none;">
          <input type="checkbox" id="leadform-marketing-consent" name="marketingConsent" class="leadform-checkbox" checked>
          <label for="leadform-marketing-consent" class="leadform-checkbox-label">
            ${this.marketingConsentText}
          </label>
        </div>
      `
    }

    return consentFields
  }

  private generateFields(): string {
    const fieldMap: Record<
      string,
      { label: string; type: string; placeholder: string; required: boolean }
    > = {
      name: {
        label: this.config.nameFieldLabel!,
        type: 'text',
        placeholder: this.config.nameFieldPlaceholder!,
        required: true,
      },
      email: {
        label: this.config.emailFieldLabel!,
        type: 'email',
        placeholder: this.config.emailFieldPlaceholder!,
        required: true,
      },
      company: {
        label: this.config.companyFieldLabel!,
        type: 'text',
        placeholder: this.config.companyFieldPlaceholder!,
        required: false,
      },
      phone: {
        label: this.config.phoneFieldLabel!,
        type: 'tel',
        placeholder: this.config.phoneFieldPlaceholder!,
        required: false,
      },
      message: {
        label: this.config.messageFieldLabel!,
        type: 'textarea',
        placeholder: this.config.messageFieldPlaceholder!,
        required: false,
      },
    }

    return this.config.fields
      .map(fieldName => {
        const field = fieldMap[fieldName]
        if (!field) return ''

        const isTextarea = field.type === 'textarea'
        const fieldId = `leadform-${fieldName}`
        const inputElement = isTextarea
          ? `<textarea class="leadform-input leadform-textarea" name="${fieldName}" id="${fieldId}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>`
          : `<input class="leadform-input" type="${field.type}" name="${fieldName}" id="${fieldId}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`

        return `
        <div class="leadform-field">
          <label class="leadform-label" for="${fieldId}">${field.label}${field.required ? ' *' : ''}</label>
          ${inputElement}
          <div class="leadform-error" id="${fieldId}-error"></div>
        </div>
      `
      })
      .join('')
  }

  private createFloatingTrigger(): void {
    const trigger = document.createElement('button')
    trigger.className = 'leadform-trigger'
    trigger.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `
    trigger.setAttribute('aria-label', 'Open contact form')

    trigger.addEventListener('click', () => this.toggle())
    this.container.appendChild(trigger)
  }

  private attachEventListeners(): void {
    const form = this.container.querySelector(
      '.leadform-form'
    ) as HTMLFormElement
    const closeButton = this.container.querySelector(
      '.leadform-close'
    ) as HTMLButtonElement

    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide())
    }

    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e))
    }

    // Listen for email input changes to show/hide marketing consent
    if (this.config.requireMarketingConsent) {
      const emailInput = this.container.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement
      if (emailInput) {
        emailInput.addEventListener('input', () => this.handleEmailChange())
        emailInput.addEventListener('blur', () => this.handleEmailChange())
      }
    }
  }

  private handleEmailChange(): void {
    const emailInput = this.container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement
    const marketingConsentField = this.container.querySelector(
      '#leadform-marketing-consent-field'
    ) as HTMLDivElement

    if (!emailInput || !marketingConsentField) return

    const email = emailInput.value
    const isValidEmail = validateEmail(email)

    if (isValidEmail) {
      marketingConsentField.style.display = 'flex'
    } else {
      marketingConsentField.style.display = 'none'
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault()

    if (this.isSubmitting) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data: LeadFormData = {}

    // Clear previous errors
    this.clearErrors()

    // Check honeypot field
    const honeypotValue = formData.get('website') as string
    if (honeypotValue && honeypotValue.trim() !== '') {
      console.warn('LeadForm: Honeypot field filled, likely spam')
      this.showError('Honeypot field filled')
      this.emit('error', { type: 'honeypot', message: 'Honeypot field filled' })
      return
    }

    // Check submission timing
    const submissionTime = Date.now() - this.formStartTime
    if (submissionTime < 3000) {
      console.warn('LeadForm: Form submitted too quickly, likely spam')
      this.showError('Form submitted too quickly')
      this.emit('error', {
        type: 'timing',
        message: 'Form submitted too quickly',
      })
      return
    }

    // Get marketing consent status
    const marketingConsentGiven = formData.get('marketingConsent') === 'on'

    // Collect form data (excluding honeypot and consent checkboxes)
    formData.forEach((value, key) => {
      if (
        key !== 'consent' &&
        key !== 'marketingConsent' &&
        key !== 'website'
      ) {
        data[key] = value as string
      }
    })

    // Basic validation
    if (!this.validateForm(data)) {
      this.emit('error', {
        type: 'validation',
        message: 'Form validation failed',
      })
      return
    }

    this.setSubmitting(true)

    try {
      const result = await this.submitLead(
        data,
        this.config.requireConsent
          ? {
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              consentGiven: true,
              marketingConsentRequested: this.config.requireMarketingConsent,
              consentText: this.consentText,
              marketingConsentText: this.marketingConsentText,
              marketingConsentGiven,
            }
          : null
      )

      this.emit('submit', { data, result })
      this.showSuccess()
      // Auto-hide after success
      setTimeout(() => this.hide(), 3000)
    } catch (error) {
      this.showError('Failed to submit form')
      this.emit('error', {
        type: 'submission',
        message: 'Failed to submit form',
        error,
      })
      console.error('Lead form submission error:', error)
    } finally {
      this.setSubmitting(false)
    }
  }

  private validateForm(data: LeadFormData): boolean {
    let isValid = true

    // Check if form includes email and/or phone fields
    const hasEmailField = this.config.fields.includes('email')
    const hasPhoneField = this.config.fields.includes('phone')

    // Individual field validation
    this.config.fields.forEach(fieldName => {
      const fieldMap: Record<
        string,
        { required: boolean; validate?: (value: string) => boolean }
      > = {
        name: { required: true },
        email: {
          required: true,
          validate: (value: string) => validateEmail(value),
        },
        company: { required: false },
        phone: {
          required: false,
          validate: (value: string) => validatePhone(value),
        },
        message: { required: false },
      }

      const field = fieldMap[fieldName]
      const value = data[fieldName] || ''

      // Skip required check for email and phone if we need to validate them together
      const skipRequiredCheck =
        (fieldName === 'email' || fieldName === 'phone') &&
        hasEmailField &&
        hasPhoneField

      if (field?.required && !skipRequiredCheck && !value.trim()) {
        this.showFieldError(fieldName, 'This field is required')
        isValid = false
      } else if (value && field?.validate && !field.validate(value)) {
        if (fieldName === 'email') {
          this.showFieldError(fieldName, 'Please enter a valid email address')
        } else if (fieldName === 'phone') {
          this.showFieldError(fieldName, 'Please enter a valid phone number')
        }
        isValid = false
      }
    })

    // Special validation: if both email and phone are present, require at least one
    if (hasEmailField && hasPhoneField) {
      const email = data.email || ''
      const phone = data.phone || ''

      const hasValidEmail = email.trim() && validateEmail(email)
      const hasValidPhone = phone.trim() && validatePhone(phone)

      if (!hasValidEmail && !hasValidPhone) {
        this.showFieldError(
          'email',
          'Please provide either a valid email or phone number'
        )
        this.showFieldError(
          'phone',
          'Please provide either a valid email or phone number'
        )
        isValid = false
      }
    }

    return isValid
  }

  private showFieldError(fieldName: string, message: string): void {
    const errorElement = this.container.querySelector(
      `#leadform-${fieldName}-error`
    ) as HTMLDivElement
    if (errorElement) {
      errorElement.textContent = message
    }
  }

  private clearErrors(): void {
    const errorElements = this.container.querySelectorAll('.leadform-error')
    errorElements.forEach(element => {
      element.textContent = ''
    })
  }

  private showError(message: string): void {
    console.error(message)
  }

  private setSubmitting(isSubmitting: boolean): void {
    this.isSubmitting = isSubmitting
    const submitButton = this.container.querySelector(
      '.leadform-submit'
    ) as HTMLButtonElement
    const spinner = this.container.querySelector(
      '.leadform-spinner'
    ) as HTMLDivElement

    if (submitButton) {
      submitButton.disabled = isSubmitting
      if (isSubmitting) {
        submitButton.classList.add('leadform-submit-loading')
        spinner.style.display = 'block'
      } else {
        submitButton.classList.remove('leadform-submit-loading')
        spinner.style.display = 'none'
      }
    }
  }

  private async submitLead(
    data: LeadFormData,
    consentEvent: ConsentEvent | null
  ): Promise<void> {
    const apiEndpoint =
      this.config.apiEndpoint || 'https://api.loubase.com/leads'

    const payload: CaptureLeadPayload = {
      siteSlug: this.config.siteSlug,
      sitePublicKey: this.config.sitePublicKey,
      formData: data,
      source: 'embed',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      deviceFingerprint: this.deviceFingerprint,
      consentEvent,
      submissionTime: Date.now() - this.formStartTime,
      idempotencyKey: this.idempotencyKey,
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': this.idempotencyKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private showSuccess(): void {
    const formContainer = this.container.querySelector(
      '.leadform-container'
    ) as HTMLDivElement
    formContainer.innerHTML = `
      <button class="leadform-close" aria-label="${this.config.closeButtonLabel}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="leadform-success">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 16px; color: #22c55e;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        <h3 style="margin: 0 0 8px 0;">${this.config.successTitle}</h3>
        <p style="margin: 0; color: var(--leadform-muted-foreground); font-size: 14px;">${this.config.successSubtitle}</p>
      </div>
    `

    // Attach close event listener for the success message
    const closeButton = this.container.querySelector(
      '.leadform-close'
    ) as HTMLButtonElement
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide())
    }
  }

  public show(): void {
    const formContainer = this.container.querySelector(
      '.leadform-container'
    ) as HTMLDivElement
    if (formContainer) {
      formContainer.classList.add('visible')
      formContainer.setAttribute('aria-hidden', 'false')
      formContainer.setAttribute('role', 'dialog')
      formContainer.setAttribute('aria-modal', 'true')
    }

    this.isVisible = true
    this.emit('open')
  }

  public hide(): void {
    const formContainer = this.container.querySelector(
      '.leadform-container'
    ) as HTMLDivElement
    if (formContainer) {
      formContainer.classList.remove('visible')
      formContainer.setAttribute('aria-hidden', 'true')
    }

    this.isVisible = false
    this.emit('close')
  }

  public toggle(): void {
    if (this.isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.onKeydown)

    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }

    // Remove styles if no other widgets exist
    const existingWidgets = document.querySelectorAll('.leadform-widget')
    if (existingWidgets.length === 0) {
      const styleElement = document.getElementById('leadform-widget-styles')
      if (styleElement) {
        styleElement.remove()
      }
    }

    this.eventListeners.clear()
  }
}

// Global API
declare global {
  interface Window {
    LeadFormWidget: typeof LeadFormWidget
    LeadForm: {
      open: () => void
      close: () => void
      on: (event: EventType, callback: Function) => void
      destroy: () => void
      version: string
    }
  }
}

// Global instance
let globalWidget: LeadFormWidget | null = null

// Export LeadFormWidget for direct use
window.LeadFormWidget = LeadFormWidget

window.LeadForm = {
  open: () => {
    if (!globalWidget) {
      const config = getConfigFromScript()
      if (config) {
        globalWidget = new LeadFormWidget(config)
      }
    }
    globalWidget?.show()
  },

  close: () => {
    globalWidget?.hide()
  },

  on: (event: EventType, callback: Function) => {
    globalWidget?.on(event, callback)
  },

  destroy: () => {
    globalWidget?.destroy()
    globalWidget = null
  },

  version: '1.0.0',
}

function getConfigFromScript(): LeadFormWidgetConfig | null {
  const scripts = document.querySelectorAll('script[data-site-id]')
  const script = scripts[scripts.length - 1] as HTMLScriptElement

  if (!script || !script.dataset.siteId) return null

  if (!script.dataset.siteSlug || !script.dataset.sitePublicKey) return null

  return {
    siteSlug: script.dataset.siteSlug,
    sitePublicKey: script.dataset.sitePublicKey,
    theme: (script.dataset.theme as LeadFormWidgetConfig['theme']) || 'auto',
    position:
      (script.dataset.position as LeadFormWidgetConfig['position']) ||
      'bottom-right',
    fields: script.dataset.fields?.split(',') || ['name', 'email', 'message'],
    title: script.dataset.title || 'Get in touch',
    buttonText: script.dataset.buttonText || 'Contact us',
    successMessage:
      script.dataset.successMessage || "Thanks — we'll reply ASAP.",
    requireConsent: script.dataset.requireConsent === 'true',
    requireMarketingConsent: script.dataset.requireMarketingConsent === 'true',
    accentColorHex: script.dataset.accentColorHex || '#3b82f6',
    // configurable text fields
    subtitle: script.dataset.subtitle,
    closeButtonLabel: script.dataset.closeButtonLabel,
    nameFieldLabel: script.dataset.nameFieldLabel,
    emailFieldLabel: script.dataset.emailFieldLabel,
    companyFieldLabel: script.dataset.companyFieldLabel,
    phoneFieldLabel: script.dataset.phoneFieldLabel,
    messageFieldLabel: script.dataset.messageFieldLabel,
    nameFieldPlaceholder: script.dataset.nameFieldPlaceholder,
    emailFieldPlaceholder: script.dataset.emailFieldPlaceholder,
    companyFieldPlaceholder: script.dataset.companyFieldPlaceholder,
    phoneFieldPlaceholder: script.dataset.phoneFieldPlaceholder,
    messageFieldPlaceholder: script.dataset.messageFieldPlaceholder,
    successTitle: script.dataset.successTitle,
    successSubtitle: script.dataset.successSubtitle,
    apiEndpoint: script.dataset.apiEndpoint,
  }
}

// Auto-initialization from script tag attributes
function initFromScript(): void {
  const config = getConfigFromScript()
  if (!config) return

  globalWidget = new LeadFormWidget(config)
}

// Auto-init if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFromScript)
} else {
  initFromScript()
}

export { LeadFormWidget, type LeadFormData, type LeadFormWidgetConfig }
