var C="We value your privacy. By submitting this form, you consent to us storing your details for the purpose of responding to your request.",E="I agree to receive marketing communications relevant to my request. I understand I can unsubscribe at any time.",$=()=>`${Date.now()}-${Math.random().toString(36).substr(2,9)}`;function y(i){return!i||i.trim()===""?!1:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.trim())}function k(i){if(!i||i.trim()==="")return!1;let t=i.replace(/[^\d+]/g,"").replace(/[^\d]/g,"");if(t.length<10||t.length>15)return!1;let r=!1;if(t.length===10?r=/^[2-9]\d{2}[2-9]\d{6}$/.test(t):t.length===11&&t[0]==="1"?r=/^1[2-9]\d{2}[2-9]\d{6}$/.test(t):t.length>=11&&t.length<=15&&(r=/^\d{7,15}$/.test(t)),r){if(/^(\d)\1{6,}$/.test(t))return!1;let s=["012345","123456","234567","345678","456789","567890","654321","543210","432109","321098","210987","109876","098765"];for(let o of s)if(t.includes(o))return!1}return r}import{useCallback as U,useEffect as re,useRef as ie,useState as w}from"react";import{jsx as f,jsxs as b}from"react/jsx-runtime";var oe={theme:"auto",fields:["name","email","message"],title:"Get in touch",subtitle:"We'd love to hear from you. Send us a message and we'll respond as soon as possible.",buttonText:"Send message",successMessage:"Thank you! We'll get back to you soon.",requireConsent:!0,requireMarketingConsent:!1,accentColorHex:"#3b82f6",nameFieldLabel:"Name",emailFieldLabel:"Email",companyFieldLabel:"Company",phoneFieldLabel:"Phone",messageFieldLabel:"Message",nameFieldPlaceholder:"Your name",emailFieldPlaceholder:"your@email.com",companyFieldPlaceholder:"Your company",phoneFieldPlaceholder:"Your phone number",messageFieldPlaceholder:"Your message...",successTitle:"Thank you!",successSubtitle:"We'll get back to you as soon as possible.",apiEndpoint:"https://api.loubase.com/v1/leads"},ae=({siteSlug:i,sitePublicKey:e,onSubmit:t,onError:r,className:s="",style:o,showSuccessMessage:n=!0,dataTestId:a="simple-leadform",mockSubmit:l=!1,...h})=>{let[u,L]=w(!1),[S,T]=w(!1),[q,M]=w({}),[m,_]=w({}),[Q,ee]=w(!1),[z,A]=w(null),K=ie(!1),d={...oe,siteSlug:i,sitePublicKey:e,...h};re(()=>{if(K.current||document.getElementById("simple-leadform-styles"))return;let v=document.createElement("style");v.id="simple-leadform-styles";let c=ne(d.accentColorHex)||"#3b82f6";v.textContent=`
      .simple-leadform {
        --leadform-primary: ${c};
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
        background: var(--leadform-background);
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        padding: 24px;
        max-width: 100%;
      }

      @media (prefers-color-scheme: dark) {
        .simple-leadform[data-theme="auto"] {
          --leadform-background: #0f172a;
          --leadform-foreground: #f8fafc;
          --leadform-muted: #1e293b;
          --leadform-muted-foreground: #94a3b8;
          --leadform-border: #334155;
          --leadform-input: #1e293b;
        }
      }

      .simple-leadform[data-theme="dark"] {
        --leadform-background: #0f172a;
        --leadform-foreground: #f8fafc;
        --leadform-muted: #1e293b;
        --leadform-muted-foreground: #94a3b8;
        --leadform-border: #334155;
        --leadform-input: #1e293b;
      }

      .simple-leadform * {
        box-sizing: border-box;
      }

      .simple-leadform-header {
        margin-bottom: 24px;
        text-align: left;
      }

      .simple-leadform-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: var(--leadform-foreground);
      }

      .simple-leadform-subtitle {
        font-size: 14px;
        color: var(--leadform-muted-foreground);
        margin: 0;
        line-height: 1.4;
      }

      .simple-leadform-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .simple-leadform-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .simple-leadform-field.hidden {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }

      .simple-leadform-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--leadform-foreground);
      }

      .simple-leadform-input {
        padding: 12px 16px;
        border: 1px solid var(--leadform-border);
        border-radius: 8px;
        background: var(--leadform-input);
        color: var(--leadform-foreground);
        font-size: 14px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .simple-leadform-input:focus {
        outline: none;
        border-color: var(--leadform-ring);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .simple-leadform-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .simple-leadform-checkbox-field {
        flex-direction: row;
        align-items: flex-start;
        gap: 12px;
      }

      .simple-leadform-checkbox {
        margin-top: 2px;
        width: 16px;
        height: 16px;
      }

      .simple-leadform-checkbox-label {
        font-size: 12px;
        color: var(--leadform-muted-foreground);
        line-height: 1.4;
      }

      .simple-leadform-submit {
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

      .simple-leadform-submit:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      .simple-leadform-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .simple-leadform-submit-loading {
        color: transparent;
      }

      .simple-leadform-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid var(--leadform-primary-foreground);
        border-radius: 50%;
        animation: simple-leadform-spin 1s linear infinite;
      }

      @keyframes simple-leadform-spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .simple-leadform-success {
        text-align: center;
        padding: 20px;
        color: var(--leadform-foreground);
      }

      .simple-leadform-error {
        color: var(--leadform-destructive);
        font-size: 12px;
        margin-top: 4px;
      }
    `,document.head.appendChild(v),K.current=!0},[d.accentColorHex,d.theme]);let V=U((v,c)=>{if(_(F=>({...F,[v]:c})),q[v]&&M(F=>({...F,[v]:""})),v==="email"&&d.requireMarketingConsent){let F=y(c);ee(F)}},[q,d.requireMarketingConsent]),te=U(async v=>{var B,R,N,W,O,j,Y,I;if(v.preventDefault(),u)return;let c={},F=J(d);d.fields.forEach(g=>{var G;let x=F[g];x!=null&&x.required&&!((G=m[g])!=null&&G.trim())&&(c[g]=`${x.label} is required`)});let D=d.fields.includes("email"),H=d.fields.includes("phone");if(D&&!H&&((B=m.email)!=null&&B.trim()?y(m.email)||(c.email="Please enter a valid email address"):c.email="Email is required"),H&&!D&&((R=m.phone)!=null&&R.trim()?k(m.phone)||(c.phone="Please enter a valid phone number"):c.phone="Phone is required"),D&&H)if(!((N=m.email)!=null&&N.trim())&&!((W=m.phone)!=null&&W.trim()))c.email="Email or phone is required",c.phone="Email or phone is required";else if((O=m.email)!=null&&O.trim()&&((j=m.phone)!=null&&j.trim())){let g=y(m.email),x=k(m.phone);g||(c.email="Please enter a valid email address"),x||(c.phone="Please enter a valid phone number")}else(Y=m.phone)!=null&&Y.trim()?k(m.phone)||(c.phone="Please enter a valid phone number"):(I=m.email)!=null&&I.trim()&&(y(m.email)||(c.email="Please enter a valid email address"));if(d.requireConsent&&m.consent!=="true"&&(c.consent="Consent is required"),Object.keys(c).length>0){M(c);return}L(!0),M({}),A(Date.now());try{let g=await fe(d,m,z,l);n&&T(!0),t==null||t({data:m,result:g})}catch(g){let x={type:"submission",message:"Failed to submit form. Please try again.",error:g};r==null||r(x)}finally{L(!1),A(null)}},[d,m,u,t,r,n,z]);return S&&n?f("div",{className:`simple-leadform ${s}`,"data-theme":d.theme,"data-testid":`${a}-success`,style:o,children:b("div",{className:"simple-leadform-success",children:[b("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",style:{margin:"0 auto 16px",color:"#22c55e"},"data-testid":`${a}-success-icon`,children:[f("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),f("polyline",{points:"22,4 12,14.01 9,11.01"})]}),f("h3",{style:{margin:"0 0 8px 0"},"data-testid":`${a}-success-title`,children:d.successTitle}),f("p",{style:{margin:"0",color:"var(--leadform-muted-foreground)",fontSize:"14px"},"data-testid":`${a}-success-subtitle`,children:d.successSubtitle})]})}):b("div",{className:`simple-leadform ${s}`,"data-theme":d.theme,"data-testid":a,style:o,children:[(d.title||d.subtitle)&&b("div",{className:"simple-leadform-header","data-testid":`${a}-header`,children:[d.title&&f("h3",{className:"simple-leadform-title","data-testid":`${a}-title`,children:d.title}),d.subtitle&&f("p",{className:"simple-leadform-subtitle","data-testid":`${a}-subtitle`,children:d.subtitle})]}),b("form",{className:"simple-leadform-form",onSubmit:te,"data-testid":`${a}-form`,children:[se(d,m,q,V,a),b("div",{className:"simple-leadform-field hidden","data-testid":`${a}-honeypot`,children:[f("label",{className:"simple-leadform-label",htmlFor:"simple-leadform-website",children:"Website"}),f("input",{className:"simple-leadform-input",type:"text",name:"website",id:"simple-leadform-website",tabIndex:-1,autoComplete:"off"})]}),le(d,m,q,V,Q,a),b("button",{type:"submit",className:`simple-leadform-submit ${u?"simple-leadform-submit-loading":""}`,disabled:u,"data-testid":`${a}-submit-button`,children:[f("span",{className:"simple-leadform-submit-text","data-testid":`${a}-submit-text`,children:d.buttonText}),f("div",{className:"simple-leadform-spinner",style:{display:u?"block":"none"},"data-testid":`${a}-submit-spinner`})]})]})]})};function ne(i){return i&&/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(i)?i:null}function J(i){return{name:{label:i.nameFieldLabel,type:"text",placeholder:i.nameFieldPlaceholder,required:!0},email:{label:i.emailFieldLabel,type:"email",placeholder:i.emailFieldPlaceholder,required:!0},company:{label:i.companyFieldLabel,type:"text",placeholder:i.companyFieldPlaceholder,required:!1},phone:{label:i.phoneFieldLabel,type:"tel",placeholder:i.phoneFieldPlaceholder,required:!1},message:{label:i.messageFieldLabel,type:"textarea",placeholder:i.messageFieldPlaceholder,required:!1}}}function se(i,e,t,r,s){let o=J(i);return i.fields.map(n=>{let a=o[n];if(!a)return null;let l=a.type==="textarea",h=`simple-leadform-${n}`,u=e[n]||"",L=t[n],S={name:n,id:h,placeholder:a.placeholder,required:a.required,value:u,onChange:T=>r(n,T.target.value)};return b("div",{className:"simple-leadform-field","data-testid":`${s}-field-${n}`,children:[b("label",{className:"simple-leadform-label",htmlFor:h,"data-testid":`${s}-label-${n}`,children:[a.label,a.required?" *":""]}),l?f("textarea",{...S,className:"simple-leadform-input simple-leadform-textarea","data-testid":`${s}-input-${n}`}):f("input",{...S,type:a.type,className:"simple-leadform-input","data-testid":`${s}-input-${n}`}),L&&f("div",{className:"simple-leadform-error","data-testid":`${s}-error-${n}`,children:L})]},n)}).filter(Boolean)}function le(i,e,t,r,s,o){let n=[];if(i.requireConsent){let a=t.consent;n.push(b("div",{className:"simple-leadform-field simple-leadform-checkbox-field","data-testid":`${o}-field-consent`,children:[f("input",{type:"checkbox",id:"simple-leadform-consent",name:"consent",className:"simple-leadform-checkbox",required:!0,checked:e.consent==="true",onChange:l=>r("consent",l.target.checked?"true":"false"),"data-testid":`${o}-checkbox-consent`}),b("div",{style:{flex:1},children:[f("label",{htmlFor:"simple-leadform-consent",className:"simple-leadform-checkbox-label","data-testid":`${o}-label-consent`,children:C}),a&&f("div",{className:"simple-leadform-error","data-testid":`${o}-error-consent`,children:a})]})]},"consent"))}return i.requireMarketingConsent&&s&&n.push(b("div",{className:"simple-leadform-field simple-leadform-checkbox-field","data-testid":`${o}-field-marketing-consent`,children:[f("input",{type:"checkbox",id:"simple-leadform-marketing-consent",name:"marketingConsent",className:"simple-leadform-checkbox",checked:e.marketingConsent==="true",onChange:a=>r("marketingConsent",a.target.checked?"true":"false"),"data-testid":`${o}-checkbox-marketing-consent`}),f("label",{htmlFor:"simple-leadform-marketing-consent",className:"simple-leadform-checkbox-label","data-testid":`${o}-label-marketing-consent`,children:E})]},"marketing-consent")),n}function de(){return typeof window=="undefined"?{screen:"",timezone:"",language:"",platform:"",cookieEnabled:!1,doNotTrack:null}:{screen:`${window.screen.width}x${window.screen.height}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"",language:navigator.language||"",platform:navigator.platform||"",cookieEnabled:navigator.cookieEnabled||!1,doNotTrack:navigator.doNotTrack}}async function me(){try{return(await(await fetch("https://api.ipify.org?format=json")).json()).ip}catch(i){try{return(await(await fetch("https://ipapi.co/json/")).json()).ip}catch(e){console.warn("Could not determine client IP address");return}}}async function ce(i,e){if(!e.requireConsent&&!e.requireMarketingConsent)return null;let t=await me();return{timestamp:new Date().toISOString(),consentGiven:!0,marketingConsentRequested:e.requireMarketingConsent,marketingConsentText:E,marketingConsentGiven:i.marketingConsent==="true",consentText:C,ip:t,userAgent:navigator.userAgent||""}}async function fe(i,e,t,r){let s=i.apiEndpoint||"https://api.loubase.com/v1/leads",o=t?Date.now()-t:null,n=$(),a={siteSlug:i.siteSlug,sitePublicKey:i.sitePublicKey,formData:e,consentEvent:await ce(e,i),deviceFingerprint:de(),source:"react-form",timestamp:new Date().toISOString(),submissionTime:o,userAgent:typeof window!="undefined"?window.navigator.userAgent:"",url:typeof window!="undefined"?window.location.href:"",idempotencyKey:n};if(r)return{success:!0,message:"Form submitted successfully"};try{let l=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json","X-Idempotency-Key":n},body:JSON.stringify(a)});if(!l.ok){let u=await l.text();throw new Error(`HTTP ${l.status}: ${u}`)}return await l.json()}catch(l){throw console.error("Lead form submission error:",l),l}}var P=class{constructor(e){this.isVisible=!1;this.isSubmitting=!1;this.formStartTime=0;this.idempotencyKey="";this.eventListeners=new Map;this.onKeydown=e=>{e.key==="Escape"&&this.isVisible&&this.hide()};this.config=this.validateConfig(e),this.container=document.createElement("div"),this.deviceFingerprint=this.generateDeviceFingerprint(),this.validateOrigin(),this.init(),document.addEventListener("keydown",this.onKeydown),this.consentText=C,this.marketingConsentText=E}validateConfig(e){if(!e.siteSlug)throw new Error("LeadForm: siteSlug is required");if(!e.sitePublicKey)throw new Error("LeadForm: sitePublicKey is required");return{...e,subtitle:e.subtitle||"We'd love to hear from you. Send us a message and we'll respond as soon as possible.",closeButtonLabel:e.closeButtonLabel||"Close",nameFieldLabel:e.nameFieldLabel||"Name",emailFieldLabel:e.emailFieldLabel||"Email",companyFieldLabel:e.companyFieldLabel||"Company",phoneFieldLabel:e.phoneFieldLabel||"Phone",messageFieldLabel:e.messageFieldLabel||"Message",nameFieldPlaceholder:e.nameFieldPlaceholder||"Your name",emailFieldPlaceholder:e.emailFieldPlaceholder||"your.email@example.com",companyFieldPlaceholder:e.companyFieldPlaceholder||"Your company",phoneFieldPlaceholder:e.phoneFieldPlaceholder||"(555) 123-4567",messageFieldPlaceholder:e.messageFieldPlaceholder||"Tell us about your project...",successTitle:e.successTitle||e.successMessage||"Success",successSubtitle:e.successSubtitle||"We'll get back to you soon!"}}validateOrigin(){let e=window.location.origin,t=window.location.protocol;t!=="https:"&&t!=="http:"&&e!=="http://localhost:3000"&&console.warn("LeadForm: HTTPS is required for production use")}generateDeviceFingerprint(){return{screen:`${screen.width}x${screen.height}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,language:navigator.language,platform:navigator.platform,cookieEnabled:navigator.cookieEnabled,doNotTrack:navigator.doNotTrack}}emit(e,t){let r=this.eventListeners.get(e);r&&r.forEach(s=>{try{s(t)}catch(o){console.error(`Error in ${e} event listener:`,o)}})}on(e,t){this.eventListeners.has(e)||this.eventListeners.set(e,new Set),this.eventListeners.get(e).add(t)}off(e,t){let r=this.eventListeners.get(e);r&&r.delete(t)}init(){this.injectStyles(),this.createForm(),this.createFloatingTrigger(),this.attachEventListeners(),document.body.appendChild(this.container)}injectStyles(){if(document.getElementById("leadform-widget-styles"))return;let e=document.createElement("style");e.id="leadform-widget-styles";let t=this.normalizeColor(this.config.accentColorHex)||"#3b82f6";e.textContent=`
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
    `,document.head.appendChild(e)}normalizeColor(e){if(!e)return null;if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(e))return e;let t=document.createElement("div");return t.style.color="",t.style.color=e,t.style.color?getComputedStyle(t).color:null}createForm(){this.formStartTime=Date.now(),this.idempotencyKey=$(),this.container.className="leadform-widget",this.container.setAttribute("data-theme",this.config.theme);let e=document.createElement("div");e.className=`leadform-container ${this.config.position}`;let t=`
      <div class="leadform-field hidden">
        <label class="leadform-label" for="leadform-website">Website</label>
        <input class="leadform-input" type="text" name="website" id="leadform-website" tabindex="-1" autocomplete="off">
      </div>
    `,r=this.generateConsentFields();e.innerHTML=`
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
        ${r}
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
      `),e}generateFields(){let e={name:{label:this.config.nameFieldLabel,type:"text",placeholder:this.config.nameFieldPlaceholder,required:!0},email:{label:this.config.emailFieldLabel,type:"email",placeholder:this.config.emailFieldPlaceholder,required:!0},company:{label:this.config.companyFieldLabel,type:"text",placeholder:this.config.companyFieldPlaceholder,required:!1},phone:{label:this.config.phoneFieldLabel,type:"tel",placeholder:this.config.phoneFieldPlaceholder,required:!1},message:{label:this.config.messageFieldLabel,type:"textarea",placeholder:this.config.messageFieldPlaceholder,required:!1}};return this.config.fields.map(t=>{let r=e[t];if(!r)return"";let s=r.type==="textarea",o=`leadform-${t}`,n=s?`<textarea class="leadform-input leadform-textarea" name="${t}" id="${o}" placeholder="${r.placeholder}" ${r.required?"required":""}></textarea>`:`<input class="leadform-input" type="${r.type}" name="${t}" id="${o}" placeholder="${r.placeholder}" ${r.required?"required":""}>`;return`
        <div class="leadform-field">
          <label class="leadform-label" for="${o}">${r.label}${r.required?" *":""}</label>
          ${n}
          <div class="leadform-error" id="${o}-error"></div>
        </div>
      `}).join("")}createFloatingTrigger(){let e=document.createElement("button");e.className="leadform-trigger",e.innerHTML=`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `,e.setAttribute("aria-label","Open contact form"),e.addEventListener("click",()=>this.toggle()),this.container.appendChild(e)}attachEventListeners(){let e=this.container.querySelector(".leadform-form"),t=this.container.querySelector(".leadform-close");if(t&&t.addEventListener("click",()=>this.hide()),e&&e.addEventListener("submit",r=>this.handleSubmit(r)),this.config.requireMarketingConsent){let r=this.container.querySelector('input[name="email"]');r&&(r.addEventListener("input",()=>this.handleEmailChange()),r.addEventListener("blur",()=>this.handleEmailChange()))}}handleEmailChange(){let e=this.container.querySelector('input[name="email"]'),t=this.container.querySelector("#leadform-marketing-consent-field");if(!e||!t)return;let r=e.value;y(r)?t.style.display="flex":t.style.display="none"}async handleSubmit(e){if(e.preventDefault(),this.isSubmitting)return;let t=e.target,r=new FormData(t),s={};this.clearErrors();let o=r.get("website");if(o&&o.trim()!==""){console.warn("LeadForm: Honeypot field filled, likely spam"),this.showError("Honeypot field filled"),this.emit("error",{type:"honeypot",message:"Honeypot field filled"});return}if(Date.now()-this.formStartTime<3e3){console.warn("LeadForm: Form submitted too quickly, likely spam"),this.showError("Form submitted too quickly"),this.emit("error",{type:"timing",message:"Form submitted too quickly"});return}let a=r.get("marketingConsent")==="on";if(r.forEach((l,h)=>{h!=="consent"&&h!=="marketingConsent"&&h!=="website"&&(s[h]=l)}),!this.validateForm(s)){this.emit("error",{type:"validation",message:"Form validation failed"});return}this.setSubmitting(!0);try{let l=await this.submitLead(s,this.config.requireConsent?{timestamp:new Date().toISOString(),userAgent:navigator.userAgent,consentGiven:!0,marketingConsentRequested:this.config.requireMarketingConsent,consentText:this.consentText,marketingConsentText:this.marketingConsentText,marketingConsentGiven:a}:null);this.emit("submit",{data:s,result:l}),this.showSuccess(),setTimeout(()=>this.hide(),3e3)}catch(l){this.showError("Failed to submit form"),this.emit("error",{type:"submission",message:"Failed to submit form",error:l}),console.error("Lead form submission error:",l)}finally{this.setSubmitting(!1)}}validateForm(e){let t=!0,r=this.config.fields.includes("email"),s=this.config.fields.includes("phone");if(this.config.fields.forEach(o=>{let a={name:{required:!0},email:{required:!0,validate:u=>y(u)},company:{required:!1},phone:{required:!1,validate:u=>k(u)},message:{required:!1}}[o],l=e[o]||"",h=(o==="email"||o==="phone")&&r&&s;a!=null&&a.required&&!h&&!l.trim()?(this.showFieldError(o,"This field is required"),t=!1):l&&(a!=null&&a.validate)&&!a.validate(l)&&(o==="email"?this.showFieldError(o,"Please enter a valid email address"):o==="phone"&&this.showFieldError(o,"Please enter a valid phone number"),t=!1)}),r&&s){let o=e.email||"",n=e.phone||"",a=o.trim()&&y(o),l=n.trim()&&k(n);!a&&!l&&(this.showFieldError("email","Please provide either a valid email or phone number"),this.showFieldError("phone","Please provide either a valid email or phone number"),t=!1)}return t}showFieldError(e,t){let r=this.container.querySelector(`#leadform-${e}-error`);r&&(r.textContent=t)}clearErrors(){this.container.querySelectorAll(".leadform-error").forEach(t=>{t.textContent=""})}showError(e){console.error(e)}setSubmitting(e){this.isSubmitting=e;let t=this.container.querySelector(".leadform-submit"),r=this.container.querySelector(".leadform-spinner");t&&(t.disabled=e,e?(t.classList.add("leadform-submit-loading"),r.style.display="block"):(t.classList.remove("leadform-submit-loading"),r.style.display="none"))}async submitLead(e,t){let r=this.config.apiEndpoint||"https://api.loubase.com/leads",s={siteSlug:this.config.siteSlug,sitePublicKey:this.config.sitePublicKey,formData:e,source:"embed",timestamp:new Date().toISOString(),url:window.location.href,userAgent:navigator.userAgent,deviceFingerprint:this.deviceFingerprint,consentEvent:t,submissionTime:Date.now()-this.formStartTime,idempotencyKey:this.idempotencyKey},o=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json","X-Idempotency-Key":this.idempotencyKey},body:JSON.stringify(s)});if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);return o.json()}showSuccess(){let e=this.container.querySelector(".leadform-container");e.innerHTML=`
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
    `;let t=this.container.querySelector(".leadform-close");t&&t.addEventListener("click",()=>this.hide())}show(){let e=this.container.querySelector(".leadform-container");e&&(e.classList.add("visible"),e.setAttribute("aria-hidden","false"),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true")),this.isVisible=!0,this.emit("open")}hide(){let e=this.container.querySelector(".leadform-container");e&&(e.classList.remove("visible"),e.setAttribute("aria-hidden","true")),this.isVisible=!1,this.emit("close")}toggle(){this.isVisible?this.hide():this.show()}destroy(){if(document.removeEventListener("keydown",this.onKeydown),this.container.parentNode&&this.container.parentNode.removeChild(this.container),document.querySelectorAll(".leadform-widget").length===0){let t=document.getElementById("leadform-widget-styles");t&&t.remove()}this.eventListeners.clear()}},p=null;window.LeadFormWidget=P;window.LeadForm={open:()=>{if(!p){let i=Z();i&&(p=new P(i))}p==null||p.show()},close:()=>{p==null||p.hide()},on:(i,e)=>{p==null||p.on(i,e)},destroy:()=>{p==null||p.destroy(),p=null},version:"1.0.0"};function Z(){var t;let i=document.querySelectorAll("script[data-site-id]"),e=i[i.length-1];return!e||!e.dataset.siteId||!e.dataset.siteSlug||!e.dataset.sitePublicKey?null:{siteSlug:e.dataset.siteSlug,sitePublicKey:e.dataset.sitePublicKey,theme:e.dataset.theme||"auto",position:e.dataset.position||"bottom-right",fields:((t=e.dataset.fields)==null?void 0:t.split(","))||["name","email","message"],title:e.dataset.title||"Get in touch",buttonText:e.dataset.buttonText||"Contact us",successMessage:e.dataset.successMessage||"Thanks \u2014 we'll reply ASAP.",requireConsent:e.dataset.requireConsent==="true",requireMarketingConsent:e.dataset.requireMarketingConsent==="true",accentColorHex:e.dataset.accentColorHex||"#3b82f6",subtitle:e.dataset.subtitle,closeButtonLabel:e.dataset.closeButtonLabel,nameFieldLabel:e.dataset.nameFieldLabel,emailFieldLabel:e.dataset.emailFieldLabel,companyFieldLabel:e.dataset.companyFieldLabel,phoneFieldLabel:e.dataset.phoneFieldLabel,messageFieldLabel:e.dataset.messageFieldLabel,nameFieldPlaceholder:e.dataset.nameFieldPlaceholder,emailFieldPlaceholder:e.dataset.emailFieldPlaceholder,companyFieldPlaceholder:e.dataset.companyFieldPlaceholder,phoneFieldPlaceholder:e.dataset.phoneFieldPlaceholder,messageFieldPlaceholder:e.dataset.messageFieldPlaceholder,successTitle:e.dataset.successTitle,successSubtitle:e.dataset.successSubtitle,apiEndpoint:e.dataset.apiEndpoint}}function X(){let i=Z();i&&(p=new P(i))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X();export{P as LeadFormWidget,ae as SimpleLeadForm};
// LeadForm Embed Widget v1.0.0
//# sourceMappingURL=index.esm.js.map