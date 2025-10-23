import { useState } from 'react'
import { SimpleLeadForm } from '../src/simple-form'

/**
 * Example demonstrating the SimpleLeadForm component
 *
 * This shows how the simplified lead form can be used directly in your React
 * components without any modal or floating trigger behavior.
 */
export default function SimpleExample() {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
    setIsSubmitted(true)
    // In a real app, you'd handle the submission result here
  }

  const handleError = (error: any) => {
    console.error('Form error:', error)
    alert('There was an error submitting the form. Please try again.')
  }

  if (isSubmitted) {
    return (
      <div
        style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}
      >
        <h2>Thank you!</h2>
        <p>Your message has been submitted successfully.</p>
        <button
          onClick={() => {
            setIsSubmitted(false)
            setShowForm(false)
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Simple Lead Form Example</h1>
      <p>
        This example shows how to use the SimpleLeadForm component directly in
        your React app. The form renders inline and you control when it's shown
        or hidden.
      </p>

      {!showForm ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Show Contact Form
          </button>
        </div>
      ) : (
        <div style={{ margin: '40px 0' }}>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Hide Form
            </button>
          </div>

          <SimpleLeadForm
            siteId="example-site"
            title="Get in Touch"
            subtitle="We'd love to hear from you! Send us a message and we'll respond as soon as possible."
            fields={['name', 'email', 'company', 'message']}
            buttonText="Send Message"
            accentColorHex="#3b82f6"
            onSubmit={handleSubmit}
            onError={handleError}
            showSuccessMessage={false} // We handle success state ourselves
            style={{ maxWidth: '400px', margin: '0 auto' }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
        }}
      >
        <h3>Usage</h3>
        <pre style={{ fontSize: '14px', overflow: 'auto' }}>
          {`import { SimpleLeadForm } from '@loubase/leadform-embed/simple'

function ContactPage() {
  return (
    <SimpleLeadForm
      siteId="your-site-id"
      title="Contact Us"
      fields={['name', 'email', 'message']}
      onSubmit={(data) => console.log('Submitted:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}`}
        </pre>
      </div>
    </div>
  )
}
