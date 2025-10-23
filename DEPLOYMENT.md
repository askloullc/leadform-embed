# LeadForm Embed - Deployment Guide

## Cloudflare Deployment

### 1. Build and Prepare Files

```bash
cd packages/leadform-embed
pnpm run build
```

This creates:
- `dist/index.iife.min.js` - Main embed script (4.6KB gzipped)
- `dist/index.esm.js` - ES module version
- `dist/index.d.ts` - TypeScript definitions

### 2. Upload to Cloudflare R2 or Workers Static Assets

#### Option A: Cloudflare R2

```bash
# Upload to R2 bucket
aws s3 cp dist/index.iife.min.js s3://your-cdn-bucket/leadform/1.0.0/ \
  --endpoint-url https://your-account-id.r2.cloudflarestorage.com \
  --content-type "application/javascript" \
  --cache-control "public, max-age=31536000, immutable"
```

#### Option B: Cloudflare Workers

Create a Cloudflare Worker to serve the static file:

```javascript
// worker.js
const LEADFORM_SCRIPT = `/* paste minified content here */`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/leadform/1.0.0/index.iife.min.js') {
      return new Response(LEADFORM_SCRIPT, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Resource-Policy': 'cross-origin'
        }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

### 3. Generate SRI Hash

```bash
# Generate integrity hash for CSP
openssl dgst -sha384 -binary dist/index.iife.min.js | openssl base64 -A
```

Example output: `sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC`

### 4. Update CDN URL

The final embed code:

```html
<script
  src="https://cdn.yourdomain.com/leadform/1.0.0/index.iife.min.js"
  integrity="sha384-YOUR_GENERATED_HASH"
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

## API Endpoint Setup

### Backend Service

Ensure your API endpoint at `https://api.loubase.com/leads` accepts:

```typescript
POST /leads
Content-Type: application/json

{
  "siteId": "string",
  "data": {
    "name": "string",
    "email": "string", 
    "company": "string?",
    "phone": "string?",
    "message": "string?"
  },
  "source": "embed",
  "timestamp": "ISO 8601 string",
  "url": "string",
  "userAgent": "string"
}
```

Response:
```json
{
  "success": true,
  "id": "lead-123"
}
```

### CORS Configuration

```javascript
// Allow embed origins
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Versioning Strategy

1. **Semantic Versioning**: Use semver for releases
2. **CDN Paths**: Include version in path: `/leadform/1.0.0/`
3. **Cache Strategy**: 
   - Long cache (1 year) for versioned files
   - Short cache (5 min) for latest aliases

## Security Considerations

### Content Security Policy

Customers should add:

```
script-src 'self' https://cdn.yourdomain.com 'sha384-YOUR_HASH';
connect-src 'self' https://api.loubase.com;
```

### Rate Limiting

Implement rate limiting on the API endpoint:
- Per IP: 10 requests/minute
- Per site ID: 100 requests/minute

### Input Validation

- Validate email format
- Sanitize all text inputs
- Check site ID against allowlist
- Validate origin header

## Monitoring

Track these metrics:

1. **Usage**: Script loads, form submissions
2. **Performance**: Load time, bundle size
3. **Errors**: JS errors, API failures
4. **Conversion**: Form open rate, completion rate

## Rollback Plan

1. Keep previous versions available
2. Update customers to previous version if needed
3. Monitor error rates after deployment

## Example Customer Integration

```html
<!-- Minimal integration -->
<script
  src="https://cdn.yourdomain.com/leadform/1.0.0/index.iife.min.js"
  data-site-id="customer-123"
></script>

<!-- Full configuration -->
<script
  src="https://cdn.yourdomain.com/leadform/1.0.0/index.iife.min.js"
  integrity="sha384-YOUR_HASH"
  crossorigin="anonymous"
  data-site-id="customer-123"
  data-mode="floating"
  data-theme="auto"
  data-position="bottom-right"
  data-fields="name,email,company,message"
  data-title="Get in touch"
  data-button-text="Contact us"
  data-success-message="Thanks — we'll reply ASAP."
  data-require-consent="true"
  data-api-endpoint="https://api.yourdomain.com/leads"
></script>
```
