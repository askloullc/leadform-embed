# LeadForm Embed Widget

A lightweight, framework-agnostic lead capture form widget that can be embedded on any website. Built with TypeScript and includes both script-based embedding and a React component for easy integration.

## 🚀 Quick Start

- **For any website**: Use the [script-based embed](#script-embed) 
- **For React apps**: Use the [React component](#react-component)

## Features

- 🪶 **Lightweight**: Only 4.6KB gzipped
- 🎨 **Customizable**: Multiple themes and configurations
- 🔒 **Isolated**: Uses Shadow DOM to prevent style conflicts
- 📱 **Responsive**: Works on desktop and mobile
- ♿ **Accessible**: Built with accessibility in mind
- 🌙 **Dark mode**: Automatic dark mode support
- 🛡️ **Secure**: Built-in validation and CSRF protection

## Installation & Usage

### Script Embed

#### CDN (Recommended)

Add this script tag to your website:

```html
<script
  src="https://cdn.loubase.com/leadform/1.0.0/index.iife.min.js"
  integrity="sha384-PASTE_SRI_FROM_CI"
  crossorigin="anonymous"
  data-site-id="YOUR_SITE_ID"
  data-mode="floating"
  data-theme="auto"
  data-position="bottom-right"
  data-fields="name,email,company,message"
  data-title="Get in touch"
  data-button-text="Contact us"
  data-success-message="Thanks — we'll reply ASAP."
  data-require-consent="true"
></script>
```

#### NPM

```bash
npm install @loubase/leadform-embed
```

```javascript
import { LeadFormWidget } from '@loubase/leadform-embed';

new LeadFormWidget({
  siteId: 'your-site-id',
  theme: 'auto',
  position: 'bottom-right',
  fields: ['name', 'email', 'company', 'message'],
  title: 'Get in touch',
  buttonText: 'Contact us',
  successMessage: 'Thanks — we\'ll reply ASAP.',
  requireConsent: true
});
```

### React Component

For React applications, use the dedicated React component:

```bash
npm install @loubase/leadform-embed
```

```tsx
import { LeadForm } from '@loubase/leadform-embed/react'

function App() {
  return (
    <LeadForm
      siteId="your-site-id"
      title="Contact Us"
      fields={['name', 'email', 'message']}
      theme="auto"
      position="bottom-right"
      onSubmit={(data) => console.log('Form submitted:', data)}
      onError={(error) => console.error('Form error:', error)}
    />
  )
}
```

👉 **[See complete React documentation](./REACT.md)**

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `siteId` | `string` | **Required** | Your unique site identifier |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' \| 'center'` | `'bottom-right'` | Position of the form |
| `fields` | `string[]` | `['name', 'email', 'message']` | Form fields to display |
| `title` | `string` | `'Get in touch'` | Form title |
| `buttonText` | `string` | `'Contact us'` | Submit button text |
| `successMessage` | `string` | `'Thanks — we\'ll reply ASAP.'` | Success message |
| `requireConsent` | `boolean` | `false` | Show privacy consent checkbox |
| `requireMarketingConsent` | `boolean` | `false` | Show marketing consent checkbox |
| `accentColorHex` | `string` | `'#3b82f6'` | Primary color (hex format) |
| `apiEndpoint` | `string` | `'https://api.loubase.com/leads'` | Custom API endpoint |

## Available Fields

- `name` - Full name (required)
- `email` - Email address (required, validated)
- `company` - Company name
- `phone` - Phone number
- `message` - Message textarea

## Styling & Themes

The widget automatically adapts to your site's color scheme:

- **Auto**: Follows system preference (light/dark)
- **Light**: Always uses light theme
- **Dark**: Always uses dark theme

All styles are encapsulated in Shadow DOM to prevent conflicts with your site's CSS.

## Content Security Policy

If you use CSP, add these directives:

```
Content-Security-Policy:
  script-src 'self' https://cdn.loubase.com 'sha384-PASTE_SRI_HASH';
  connect-src 'self' https://api.loubase.com;
  style-src 'self' 'unsafe-inline';
```

## API Endpoint

The widget submits form data to your configured endpoint with this payload:

```json
{
  "siteId": "your-site-id",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "message": "Hello!"
  },
  "source": "embed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "url": "https://example.com/page",
  "userAgent": "Mozilla/5.0..."
}
```

Expected response for success:

```json
{
  "success": true,
  "id": "lead-123"
}
```

## Development

```bash
# Install dependencies
pnpm install

# Development mode (watch)
pnpm run dev

# Build for production
pnpm run build

# Type checking
pnpm run typecheck
```

## Browser Support

- Chrome 63+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## License

UNLICENSED - © Lou LLC


old update embed

const config = getConfig();
            const fields = config.fields.join(',');
            const embedCode = `<script src="https://cdn.loubase.com/leadform/1.0.0/index.iife.min.js" data-site-id="${config.siteId}" data-mode="${config.mode}" data-theme="${config.theme}" data-position="${config.position}" data-fields="${fields}" data-title="${config.title}" data-button-text="${config.buttonText}" data-success-message="${config.successMessage}" data-require-consent="${config.requireConsent}/></script>`;
            document.getElementById('embedCode').textContent = embedCode;
