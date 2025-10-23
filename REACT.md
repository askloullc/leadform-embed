# LeadForm React Component

The LeadForm React component provides the same functionality as the script-based embed but as a React component that can be easily integrated into React applications.

## Installation

```bash
npm install @loubase/leadform-embed
# or
yarn add @loubase/leadform-embed
# or
pnpm add @loubase/leadform-embed
```

## Basic Usage

```tsx
import React from 'react'
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <LeadForm
        siteId="your-site-id"
        title="Contact Us"
        subtitle="We'd love to hear from you!"
        fields={['name', 'email', 'message']}
        theme="auto"
        position="bottom-right"
        buttonText="Send Message"
        successMessage="Thanks! We'll get back to you soon."
      />
    </div>
  )
}

export default App
```

## Props

The React component accepts all the same configuration options as the script-based widget, plus some React-specific props:

### LeadFormConfig Props
All props from the original `LeadFormConfig` interface are supported:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `siteId` | `string` | ✅ | - | Your site identifier |
| `theme` | `'light' \| 'dark' \| 'auto'` | ❌ | `'auto'` | Color theme |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' \| 'center'` | ❌ | `'bottom-right'` | Position of the form |
| `fields` | `string[]` | ❌ | `['name', 'email', 'message']` | Form fields to include |
| `title` | `string` | ❌ | `'Get in touch'` | Form title |
| `subtitle` | `string` | ❌ | `"We'd love to hear from you..."` | Form subtitle |
| `buttonText` | `string` | ❌ | `'Contact us'` | Submit button text |
| `successMessage` | `string` | ❌ | `"Thanks — we'll reply ASAP."` | Success message |
| `requireConsent` | `boolean` | ❌ | `false` | Require privacy consent |
| `requireMarketingConsent` | `boolean` | ❌ | `false` | Show marketing consent option |
| `accentColorHex` | `string` | ❌ | `'#3b82f6'` | Primary color (hex) |

### React-Specific Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `showTrigger` | `boolean` | ❌ | `true` | Show floating trigger button |
| `autoInit` | `boolean` | ❌ | `true` | Initialize widget on mount |
| `className` | `string` | ❌ | - | CSS class for container |
| `onOpen` | `() => void` | ❌ | - | Called when form opens |
| `onClose` | `() => void` | ❌ | - | Called when form closes |
| `onSubmit` | `(data) => void` | ❌ | - | Called on successful submit |
| `onError` | `(error) => void` | ❌ | - | Called on error |

## Event Handling

```tsx
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data.data)
    console.log('Server response:', data.result)
  }

  const handleError = (error) => {
    console.error('Form error:', error.type, error.message)
  }

  return (
    <LeadForm
      siteId="your-site-id"
      title="Contact Us"
      fields={['name', 'email', 'company', 'message']}
      onSubmit={handleSubmit}
      onError={handleError}
      onOpen={() => console.log('Form opened')}
      onClose={() => console.log('Form closed')}
    />
  )
}
```

## Programmatic Control

Use a ref to control the form programmatically:

```tsx
import React, { useRef } from 'react'
import { LeadForm, LeadFormRef } from '@loubase/leadform-embed/react'

function App() {
  const leadFormRef = useRef<LeadFormRef>(null)

  const handleShowForm = () => {
    leadFormRef.current?.show()
  }

  const handleHideForm = () => {
    leadFormRef.current?.hide()
  }

  return (
    <div>
      <button onClick={handleShowForm}>Show Contact Form</button>
      <button onClick={handleHideForm}>Hide Contact Form</button>
      
      <LeadForm
        ref={leadFormRef}
        siteId="your-site-id"
        title="Contact Us"
        showTrigger={false} // Hide the floating trigger
        fields={['name', 'email', 'message']}
      />
    </div>
  )
}
```

### LeadFormRef Methods

| Method | Description |
|--------|-------------|
| `show()` | Show the form dialog |
| `hide()` | Hide the form dialog |
| `toggle()` | Toggle form visibility |
| `destroy()` | Destroy the widget |
| `isVisible()` | Check if form is visible |
| `on(event, callback)` | Add event listener |
| `off(event, callback)` | Remove event listener |

## Advanced Examples

### Custom Styling

```tsx
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  return (
    <LeadForm
      siteId="your-site-id"
      title="Get Your Free Quote"
      subtitle="Fill out the form below and we'll get back to you within 24 hours."
      fields={['name', 'email', 'company', 'phone', 'message']}
      theme="dark"
      position="center"
      accentColorHex="#ff6b6b"
      buttonText="Get My Quote"
      successTitle="Quote Request Received!"
      successSubtitle="We'll email you a detailed quote within 24 hours."
      requireConsent={true}
      requireMarketingConsent={true}
    />
  )
}
```

### Integration with State Management

```tsx
import React, { useState } from 'react'
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  const [submissions, setSubmissions] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleSubmit = (data) => {
    // Add to local state
    setSubmissions(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data.data
    }])

    // Analytics tracking
    gtag('event', 'lead_form_submit', {
      form_name: 'contact_form',
      fields: Object.keys(data.data)
    })
  }

  return (
    <div>
      <h1>Contact Form Submissions: {submissions.length}</h1>
      
      <LeadForm
        siteId="your-site-id"
        title="Contact Us"
        fields={['name', 'email', 'company', 'message']}
        onSubmit={handleSubmit}
        onOpen={() => setIsFormOpen(true)}
        onClose={() => setIsFormOpen(false)}
      />
      
      {isFormOpen && <div>Form is currently open</div>}
    </div>
  )
}
```

### Multiple Forms

```tsx
import React from 'react'
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  return (
    <div>
      {/* Main contact form */}
      <LeadForm
        siteId="your-site-id"
        title="General Contact"
        fields={['name', 'email', 'message']}
        position="bottom-right"
      />
      
      {/* Newsletter signup - no trigger, programmatically controlled */}
      <LeadForm
        siteId="your-site-id-newsletter"
        title="Subscribe to Newsletter"
        fields={['name', 'email']}
        buttonText="Subscribe"
        showTrigger={false}
        position="center"
        successMessage="Thanks for subscribing!"
      />
    </div>
  )
}
```

## TypeScript Support

The component is built with TypeScript and exports all necessary types:

```tsx
import { 
  LeadForm, 
  LeadFormRef, 
  LeadFormProps,
  LeadFormConfig,
  LeadFormData,
  LeadFormEventCallbacks 
} from '@loubase/leadform-embed/react'

// All props are fully typed
const config: LeadFormConfig = {
  siteId: 'your-site-id',
  title: 'Contact Us',
  fields: ['name', 'email', 'message'],
  theme: 'auto',
  position: 'bottom-right'
}
```

## Comparison with Script Embed

| Feature | Script Embed | React Component |
|---------|--------------|-----------------|
| Installation | Script tag | npm package |
| TypeScript | ❌ | ✅ |
| React Integration | Manual | Native |
| Event Handling | Global callbacks | Props/refs |
| State Management | Manual | React hooks |
| SSR Compatible | ❌ | ✅ |
| Bundle Size | Separate script | Bundled |

## Troubleshooting

### Common Issues

1. **Form not showing**: Make sure `siteId` is provided and valid
2. **Styles not loading**: The component automatically injects styles
3. **TypeScript errors**: Ensure `@types/react` is installed
4. **Multiple instances**: Each instance should have a unique `siteId`

### Debug Mode

Enable debug logging by adding event handlers:

```tsx
<LeadForm
  siteId="your-site-id"
  onError={(error) => {
    console.error('LeadForm Error:', error)
  }}
  onOpen={() => console.log('LeadForm opened')}
  onClose={() => console.log('LeadForm closed')}
  onSubmit={(data) => console.log('LeadForm submitted:', data)}
/>
```

## Browser Support

- All modern browsers that support ES2018+
- React 16.8+ (hooks support required)
- TypeScript 4.0+ (if using TypeScript)

## License

This package is part of the Lou LLC codebase and is licensed under UNLICENSED.
