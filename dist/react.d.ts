import React from 'react';

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

interface SimpleLeadFormProps extends Partial<LeadFormConfig> {
    siteSlug: string;
    sitePublicKey: string;
    onSubmit?: (data: {
        data: LeadFormData;
        result: any;
    }) => void;
    onError?: (error: {
        type: string;
        message: string;
        error?: any;
    }) => void;
    className?: string;
    style?: React.CSSProperties;
    showSuccessMessage?: boolean;
    dataTestId?: string;
    mockSubmit?: boolean;
}
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
declare const SimpleLeadForm: React.FC<SimpleLeadFormProps>;

export { type LeadFormConfig, type LeadFormData, SimpleLeadForm, type SimpleLeadFormProps };
