var g="We value your privacy. By submitting this form, you consent to us storing your details for the purpose of responding to your request.",h="I agree to receive marketing communications relevant to my request. I understand I can unsubscribe at any time.",b=()=>`${Date.now()}-${Math.random().toString(36).substr(2,9)}`;function f(o){return!o||o.trim()===""?!1:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.trim())}function p(o){if(!o||o.trim()==="")return!1;let t=o.replace(/[^\d+]/g,"").replace(/[^\d]/g,"");if(t.length<10||t.length>15)return!1;let i=!1;if(t.length===10?i=/^[2-9]\d{2}[2-9]\d{6}$/.test(t):t.length===11&&t[0]==="1"?i=/^1[2-9]\d{2}[2-9]\d{6}$/.test(t):t.length>=11&&t.length<=15&&(i=/^\d{7,15}$/.test(t)),i){if(/^(\d)\1{6,}$/.test(t))return!1;let n=["012345","123456","234567","345678","456789","567890","654321","543210","432109","321098","210987","109876","098765"];for(let r of n)if(t.includes(r))return!1}return i}var m=class{constructor(e){this.isVisible=!1;this.isSubmitting=!1;this.formStartTime=0;this.idempotencyKey="";this.eventListeners=new Map;this.onKeydown=e=>{e.key==="Escape"&&this.isVisible&&this.hide()};this.config=this.validateConfig(e),this.container=document.createElement("div"),this.deviceFingerprint=this.generateDeviceFingerprint(),this.validateOrigin(),this.init(),document.addEventListener("keydown",this.onKeydown),this.consentText=g,this.marketingConsentText=h}validateConfig(e){if(!e.siteSlug)throw new Error("LeadForm: siteSlug is required");if(!e.sitePublicKey)throw new Error("LeadForm: sitePublicKey is required");return{...e,subtitle:e.subtitle||"We'd love to hear from you. Send us a message and we'll respond as soon as possible.",closeButtonLabel:e.closeButtonLabel||"Close",nameFieldLabel:e.nameFieldLabel||"Name",emailFieldLabel:e.emailFieldLabel||"Email",companyFieldLabel:e.companyFieldLabel||"Company",phoneFieldLabel:e.phoneFieldLabel||"Phone",messageFieldLabel:e.messageFieldLabel||"Message",nameFieldPlaceholder:e.nameFieldPlaceholder||"Your name",emailFieldPlaceholder:e.emailFieldPlaceholder||"your.email@example.com",companyFieldPlaceholder:e.companyFieldPlaceholder||"Your company",phoneFieldPlaceholder:e.phoneFieldPlaceholder||"(555) 123-4567",messageFieldPlaceholder:e.messageFieldPlaceholder||"Tell us about your project...",successTitle:e.successTitle||e.successMessage||"Success",successSubtitle:e.successSubtitle||"We'll get back to you soon!"}}validateOrigin(){let e=window.location.origin,t=window.location.protocol;t!=="https:"&&t!=="http:"&&e!=="http://localhost:3000"&&console.warn("LeadForm: HTTPS is required for production use")}generateDeviceFingerprint(){return{screen:`${screen.width}x${screen.height}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,language:navigator.language,platform:navigator.platform,cookieEnabled:navigator.cookieEnabled,doNotTrack:navigator.doNotTrack}}emit(e,t){let i=this.eventListeners.get(e);i&&i.forEach(n=>{try{n(t)}catch(r){console.error(`Error in ${e} event listener:`,r)}})}on(e,t){this.eventListeners.has(e)||this.eventListeners.set(e,new Set),this.eventListeners.get(e).add(t)}off(e,t){let i=this.eventListeners.get(e);i&&i.delete(t)}init(){this.injectStyles(),this.createForm(),this.createFloatingTrigger(),this.attachEventListeners(),document.body.appendChild(this.container)}injectStyles(){if(document.getElementById("leadform-widget-styles"))return;let e=document.createElement("style");e.id="leadform-widget-styles";let t=this.normalizeColor(this.config.accentColorHex)||"#3b82f6";e.textContent=`
      .leadform-widget {
        --leadform-primary: ${t};
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
    `,document.head.appendChild(e)}normalizeColor(e){if(!e)return null;if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(e))return e;let t=document.createElement("div");return t.style.color="",t.style.color=e,t.style.color?getComputedStyle(t).color:null}createForm(){this.formStartTime=Date.now(),this.idempotencyKey=b(),this.container.className="leadform-widget",this.container.setAttribute("data-theme",this.config.theme);let e=document.createElement("div");e.className=`leadform-container ${this.config.position}`;let t=`
      <div class="leadform-field hidden">
        <label class="leadform-label" for="leadform-website">Website</label>
        <input class="leadform-input" type="text" name="website" id="leadform-website" tabindex="-1" autocomplete="off">
      </div>
    `,i=this.generateConsentFields();e.innerHTML=`
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
        ${t}
        ${i}
        <button type="submit" class="leadform-submit">
          <span class="leadform-submit-text">${this.config.buttonText}</span>
          <div class="leadform-spinner" style="display: none;"></div>
        </button>
      </form>
    `,this.container.appendChild(e)}generateConsentFields(){let e="";return this.config.requireConsent&&(e+=`
        <div class="leadform-field leadform-checkbox-field">
          <input type="checkbox" id="leadform-consent" name="consent" class="leadform-checkbox" required>
          <label for="leadform-consent" class="leadform-checkbox-label">
            ${this.consentText}
          </label>
        </div>
      `),this.config.requireMarketingConsent&&(e+=`
        <div class="leadform-field leadform-checkbox-field" id="leadform-marketing-consent-field" style="display: none;">
          <input type="checkbox" id="leadform-marketing-consent" name="marketingConsent" class="leadform-checkbox" checked>
          <label for="leadform-marketing-consent" class="leadform-checkbox-label">
            ${this.marketingConsentText}
          </label>
        </div>
      `),e}generateFields(){let e={name:{label:this.config.nameFieldLabel,type:"text",placeholder:this.config.nameFieldPlaceholder,required:!0},email:{label:this.config.emailFieldLabel,type:"email",placeholder:this.config.emailFieldPlaceholder,required:!0},company:{label:this.config.companyFieldLabel,type:"text",placeholder:this.config.companyFieldPlaceholder,required:!1},phone:{label:this.config.phoneFieldLabel,type:"tel",placeholder:this.config.phoneFieldPlaceholder,required:!1},message:{label:this.config.messageFieldLabel,type:"textarea",placeholder:this.config.messageFieldPlaceholder,required:!1}};return this.config.fields.map(t=>{let i=e[t];if(!i)return"";let n=i.type==="textarea",r=`leadform-${t}`,d=n?`<textarea class="leadform-input leadform-textarea" name="${t}" id="${r}" placeholder="${i.placeholder}" ${i.required?"required":""}></textarea>`:`<input class="leadform-input" type="${i.type}" name="${t}" id="${r}" placeholder="${i.placeholder}" ${i.required?"required":""}>`;return`
        <div class="leadform-field">
          <label class="leadform-label" for="${r}">${i.label}${i.required?" *":""}</label>
          ${d}
          <div class="leadform-error" id="${r}-error"></div>
        </div>
      `}).join("")}createFloatingTrigger(){let e=document.createElement("button");e.className="leadform-trigger",e.innerHTML=`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `,e.setAttribute("aria-label","Open contact form"),e.addEventListener("click",()=>this.toggle()),this.container.appendChild(e)}attachEventListeners(){let e=this.container.querySelector(".leadform-form"),t=this.container.querySelector(".leadform-close");if(t&&t.addEventListener("click",()=>this.hide()),e&&e.addEventListener("submit",i=>this.handleSubmit(i)),this.config.requireMarketingConsent){let i=this.container.querySelector('input[name="email"]');i&&(i.addEventListener("input",()=>this.handleEmailChange()),i.addEventListener("blur",()=>this.handleEmailChange()))}}handleEmailChange(){let e=this.container.querySelector('input[name="email"]'),t=this.container.querySelector("#leadform-marketing-consent-field");if(!e||!t)return;let i=e.value;f(i)?t.style.display="flex":t.style.display="none"}async handleSubmit(e){if(e.preventDefault(),this.isSubmitting)return;let t=e.target,i=new FormData(t),n={};this.clearErrors();let r=i.get("website");if(r&&r.trim()!==""){console.warn("LeadForm: Honeypot field filled, likely spam"),this.showError("Honeypot field filled"),this.emit("error",{type:"honeypot",message:"Honeypot field filled"});return}if(Date.now()-this.formStartTime<3e3){console.warn("LeadForm: Form submitted too quickly, likely spam"),this.showError("Form submitted too quickly"),this.emit("error",{type:"timing",message:"Form submitted too quickly"});return}let l=i.get("marketingConsent")==="on";if(i.forEach((s,c)=>{c!=="consent"&&c!=="marketingConsent"&&c!=="website"&&(n[c]=s)}),!this.validateForm(n)){this.emit("error",{type:"validation",message:"Form validation failed"});return}this.setSubmitting(!0);try{let s=await this.submitLead(n,this.config.requireConsent?{timestamp:new Date().toISOString(),userAgent:navigator.userAgent,consentGiven:!0,marketingConsentRequested:this.config.requireMarketingConsent,consentText:this.consentText,marketingConsentText:this.marketingConsentText,marketingConsentGiven:l}:null);this.emit("submit",{data:n,result:s}),this.showSuccess(),setTimeout(()=>this.hide(),3e3)}catch(s){this.showError("Failed to submit form"),this.emit("error",{type:"submission",message:"Failed to submit form",error:s}),console.error("Lead form submission error:",s)}finally{this.setSubmitting(!1)}}validateForm(e){let t=!0,i=this.config.fields.includes("email"),n=this.config.fields.includes("phone");if(this.config.fields.forEach(r=>{let l={name:{required:!0},email:{required:!0,validate:u=>f(u)},company:{required:!1},phone:{required:!1,validate:u=>p(u)},message:{required:!1}}[r],s=e[r]||"",c=(r==="email"||r==="phone")&&i&&n;l!=null&&l.required&&!c&&!s.trim()?(this.showFieldError(r,"This field is required"),t=!1):s&&(l!=null&&l.validate)&&!l.validate(s)&&(r==="email"?this.showFieldError(r,"Please enter a valid email address"):r==="phone"&&this.showFieldError(r,"Please enter a valid phone number"),t=!1)}),i&&n){let r=e.email||"",d=e.phone||"",l=r.trim()&&f(r),s=d.trim()&&p(d);!l&&!s&&(this.showFieldError("email","Please provide either a valid email or phone number"),this.showFieldError("phone","Please provide either a valid email or phone number"),t=!1)}return t}showFieldError(e,t){let i=this.container.querySelector(`#leadform-${e}-error`);i&&(i.textContent=t)}clearErrors(){this.container.querySelectorAll(".leadform-error").forEach(t=>{t.textContent=""})}showError(e){console.error(e)}setSubmitting(e){this.isSubmitting=e;let t=this.container.querySelector(".leadform-submit"),i=this.container.querySelector(".leadform-spinner");t&&(t.disabled=e,e?(t.classList.add("leadform-submit-loading"),i.style.display="block"):(t.classList.remove("leadform-submit-loading"),i.style.display="none"))}async submitLead(e,t){let i=this.config.apiEndpoint||"https://api.loubase.com/leads",n={siteSlug:this.config.siteSlug,sitePublicKey:this.config.sitePublicKey,formData:e,source:"embed",timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,deviceFingerprint:this.deviceFingerprint,consentEvent:t,submissionTime:Date.now()-this.formStartTime,idempotencyKey:this.idempotencyKey},r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json","X-Idempotency-Key":this.idempotencyKey},body:JSON.stringify(n)});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);return r.json()}showSuccess(){let e=this.container.querySelector(".leadform-container");e.innerHTML=`
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
    `;let t=this.container.querySelector(".leadform-close");t&&t.addEventListener("click",()=>this.hide())}show(){let e=this.container.querySelector(".leadform-container");e&&(e.classList.add("visible"),e.setAttribute("aria-hidden","false"),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true")),this.isVisible=!0,this.emit("open")}hide(){let e=this.container.querySelector(".leadform-container");e&&(e.classList.remove("visible"),e.setAttribute("aria-hidden","true")),this.isVisible=!1,this.emit("close")}toggle(){this.isVisible?this.hide():this.show()}destroy(){if(document.removeEventListener("keydown",this.onKeydown),this.container.parentNode&&this.container.parentNode.removeChild(this.container),document.querySelectorAll(".leadform-widget").length===0){let t=document.getElementById("leadform-widget-styles");t&&t.remove()}this.eventListeners.clear()}},a=null;window.LeadFormWidget=m;window.LeadForm={open:()=>{if(!a){let o=y();o&&(a=new m(o))}a==null||a.show()},close:()=>{a==null||a.hide()},on:(o,e)=>{a==null||a.on(o,e)},destroy:()=>{a==null||a.destroy(),a=null},version:"1.0.0"};function y(){var t;let o=document.querySelectorAll("script[data-site-id]"),e=o[o.length-1];return!e||!e.dataset.siteId||!e.dataset.siteSlug||!e.dataset.sitePublicKey?null:{siteSlug:e.dataset.siteSlug,sitePublicKey:e.dataset.sitePublicKey,theme:e.dataset.theme||"auto",position:e.dataset.position||"bottom-right",fields:((t=e.dataset.fields)==null?void 0:t.split(","))||["name","email","message"],title:e.dataset.title||"Get in touch",buttonText:e.dataset.buttonText||"Contact us",successMessage:e.dataset.successMessage||"Thanks \u2014 we'll reply ASAP.",requireConsent:e.dataset.requireConsent==="true",requireMarketingConsent:e.dataset.requireMarketingConsent==="true",accentColorHex:e.dataset.accentColorHex||"#3b82f6",subtitle:e.dataset.subtitle,closeButtonLabel:e.dataset.closeButtonLabel,nameFieldLabel:e.dataset.nameFieldLabel,emailFieldLabel:e.dataset.emailFieldLabel,companyFieldLabel:e.dataset.companyFieldLabel,phoneFieldLabel:e.dataset.phoneFieldLabel,messageFieldLabel:e.dataset.messageFieldLabel,nameFieldPlaceholder:e.dataset.nameFieldPlaceholder,emailFieldPlaceholder:e.dataset.emailFieldPlaceholder,companyFieldPlaceholder:e.dataset.companyFieldPlaceholder,phoneFieldPlaceholder:e.dataset.phoneFieldPlaceholder,messageFieldPlaceholder:e.dataset.messageFieldPlaceholder,successTitle:e.dataset.successTitle,successSubtitle:e.dataset.successSubtitle,apiEndpoint:e.dataset.apiEndpoint}}function v(){let o=y();o&&(a=new m(o))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v):v();export{m as LeadFormWidget};
// LeadForm Embed Widget v1.0.0
//# sourceMappingURL=index.esm.js.map