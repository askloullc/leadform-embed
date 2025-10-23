# Simple Lead Form Component

The Simple Lead Form is a React component that renders a lead capture form directly in your application without any modal or floating trigger behavior. You have complete control over when and where the form is displayed.

## Installation

```bash
npm install @loubase/leadform-embed
# or
pnpm add @loubase/leadform-embed
```

## Basic Usage

```tsx
import { SimpleLeadForm } from '@loubase/leadform-embed/react'

function ContactPage() {
  return (
    <div className="max-w-md mx-auto">
      <SimpleLeadForm
        siteSlug="your-site-slug"
        sitePublicKey="your-public-key"
        title="Contact Us"
        fields={['name', 'email', 'message']}
        onSubmit={(data) => console.log('Form submitted:', data)}
        onError={(error) => console.error('Form error:', error)}
      />
    </div>
  )
}
```

## Key Differences from the Modal Version

The Simple Lead Form differs from the main `LeadForm` component in several important ways:

| Feature | SimpleLeadForm | LeadForm (Modal) |
|---------|----------------|------------------|
| Rendering | Inline, directly in your component tree | Modal overlay with trigger button |
| Visibility Control | You control with React state/logic | Built-in show/hide methods |
| Positioning | Static, follows normal document flow | Fixed positioning (floating) |
| Trigger | No trigger button included | Includes floating trigger button |
| Integration | Direct React component usage | Can be used with or without React |

## Props

### Required Props

- `siteSlug` (string): Your site slug for the lead form service
- `sitePublicKey` (string): Your site's public key for authentication

### Optional Props

All other props are optional and have sensible defaults:

```tsx
interface SimpleLeadFormProps {
  // Core configuration
  siteSlug: string
  sitePublicKey: string
  title?: string                    // Default: "Get in touch"
  subtitle?: string                 // Default: "We'd love to hear from you..."
  fields?: string[]                 // Default: ['name', 'email', 'message']
  buttonText?: string               // Default: "Send message"
  theme?: 'light' | 'dark' | 'auto' // Default: 'auto'
  accentColorHex?: string           // Default: '#3b82f6'
  
  // Field customization
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
  
  // Consent options
  requireConsent?: boolean          // Default: true
  requireMarketingConsent?: boolean // Default: false
  
  // Success handling
  showSuccessMessage?: boolean      // Default: true
  successTitle?: string
  successSubtitle?: string
  
  // Event handlers
  onSubmit?: (data: { data: LeadFormData; result: any }) => void
  onError?: (error: { type: string; message: string; error?: any }) => void
  
  // Styling
  className?: string
  style?: React.CSSProperties
}
```

## Advanced Examples

### Conditional Rendering

```tsx
function ContactSection() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <h2>Need Help?</h2>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>
          Contact Us
        </button>
      ) : (
        <SimpleLeadForm
          siteSlug="your-site-slug"
        sitePublicKey="your-public-key"
          onSubmit={() => setShowForm(false)}
          onError={(error) => console.error(error)}
        />
      )}
    </div>
  )
}
```

### Custom Success Handling

```tsx
function ContactForm() {
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')

  const handleSubmit = (data) => {
    console.log('Submitted:', data)
    setStatus('success')
  }

  const handleError = (error) => {
    console.error('Error:', error)
    setStatus('error')
  }

  if (status === 'success') {
    return <div>Thank you! We'll be in touch soon.</div>
  }

  if (status === 'error') {
    return (
      <div>
        <p>Something went wrong. Please try again.</p>
        <button onClick={() => setStatus('form')}>Try Again</button>
      </div>
    )
  }

  return (
    <SimpleLeadForm
      siteId="your-site-id"
      showSuccessMessage={false} // Handle success ourselves
      onSubmit={handleSubmit}
      onError={handleError}
    />
  )
}
```

### Custom Styling

```tsx
function StyledContactForm() {
  return (
    <SimpleLeadForm
      siteId="your-site-id"
      theme="dark"
      accentColorHex="#10b981"
      className="my-custom-form"
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}
    />
  )
}
```

## Styling

The Simple Lead Form includes built-in CSS that's automatically injected when the component is used. The form uses CSS custom properties (variables) for theming:

```css
.simple-leadform {
  --leadform-primary: #3b82f6;
  --leadform-background: #ffffff;
  --leadform-foreground: #0f172a;
  /* ... more variables */
}
```

You can override these by targeting the `.simple-leadform` class or by using the `accentColorHex` prop.

## Comparison with Script Embed

If you're currently using the script-based embed and want to migrate to the React component:

**Before (Script Embed):**
```html
<script src="https://embed.loubase.com/leadform.js"></script>
<script>
  new LeadFormWidget({
    siteId: 'your-site-id',
    // ... config
  });
</script>
```

**After (React Simple):**
```tsx
import { SimpleLeadForm } from '@loubase/leadform-embed/react'

<SimpleLeadForm
  siteId="your-site-id"
  // ... props
/>
```

## Best Practices

1. **Control Visibility**: Use React state to control when the form is shown rather than relying on built-in modal behavior.

2. **Handle Success**: Either use the built-in success message (`showSuccessMessage={true}`) or handle success in your own component (`showSuccessMessage={false}` + custom `onSubmit`).

3. **Error Handling**: Always provide an `onError` handler to gracefully handle submission failures.

4. **Accessibility**: The form includes proper ARIA labels and semantic HTML. Ensure your surrounding layout also follows accessibility best practices.

5. **Performance**: The component automatically handles CSS injection and cleanup, but you can optimize by ensuring the component isn't recreated unnecessarily.

## Migration from Modal Version

If you're migrating from the modal `LeadForm` to `SimpleLeadForm`:

1. Remove `showTrigger={false}` and ref-based control
2. Replace `ref.current?.show()` with React state to control visibility
3. Handle success/error states in your component instead of relying on the modal
4. Update import path to `/simple`

**Before:**
```tsx
const ref = useRef<LeadFormRef>(null)
// ...
<LeadForm ref={ref} showTrigger={false} />
<button onClick={() => ref.current?.show()}>Show Form</button>
```

**After:**
```tsx
const [showForm, setShowForm] = useState(false)
// ...
{showForm && <SimpleLeadForm onSubmit={() => setShowForm(false)} />}
<button onClick={() => setShowForm(true)}>Show Form</button>
```
