type LeadFormWidgetConfig = LeadFormConfig & {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
    closeButtonLabel?: string;
};
interface LeadFormConfig {
    siteSlug: string;
    sitePublicKey: string;
    theme: 'light' | 'dark' | 'auto';
    fields: string[];
    title: string | undefined;
    buttonText: string;
    successMessage: string;
    requireConsent: boolean;
    requireMarketingConsent: boolean;
    accentColorHex: string;
    subtitle?: string | undefined;
    nameFieldLabel?: string;
    emailFieldLabel?: string;
    companyFieldLabel?: string;
    phoneFieldLabel?: string;
    messageFieldLabel?: string;
    nameFieldPlaceholder?: string;
    emailFieldPlaceholder?: string;
    companyFieldPlaceholder?: string;
    phoneFieldPlaceholder?: string;
    messageFieldPlaceholder?: string;
    successTitle?: string;
    successSubtitle?: string;
    apiEndpoint?: string;
}
interface LeadFormData {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
    phone?: string;
    consent?: string;
    marketingConsent?: string;
    [key: string]: string | undefined;
}

/**
 * LeadForm Embeddable Widget
 * A simple floating lead capture form that can be embedded on any website
 */

type EventType = 'open' | 'close' | 'submit' | 'error';
declare class LeadFormWidget {
    private config;
    private container;
    private isVisible;
    private isSubmitting;
    private formStartTime;
    private idempotencyKey;
    private deviceFingerprint;
    private eventListeners;
    private consentText;
    private marketingConsentText;
    constructor(config: LeadFormWidgetConfig);
    private onKeydown;
    private validateConfig;
    private validateOrigin;
    private generateDeviceFingerprint;
    private emit;
    on(event: EventType, callback: Function): void;
    off(event: EventType, callback: Function): void;
    private init;
    private injectStyles;
    private normalizeColor;
    private createForm;
    private generateConsentFields;
    private generateFields;
    private createFloatingTrigger;
    private attachEventListeners;
    private handleEmailChange;
    private handleSubmit;
    private validateForm;
    private showFieldError;
    private clearErrors;
    private showError;
    private setSubmitting;
    private submitLead;
    private showSuccess;
    show(): void;
    hide(): void;
    toggle(): void;
    destroy(): void;
}
declare global {
    interface Window {
        LeadFormWidget: typeof LeadFormWidget;
        LeadForm: {
            open: () => void;
            close: () => void;
            on: (event: EventType, callback: Function) => void;
            destroy: () => void;
            version: string;
        };
    }
}

export { type EventType, type LeadFormData, LeadFormWidget, type LeadFormWidgetConfig };
