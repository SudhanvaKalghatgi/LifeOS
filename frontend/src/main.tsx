import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  document.getElementById('root')!.innerHTML = `
    <div style="font-family: sans-serif; padding: 2rem; color: #ff0000; text-align: center;">
      <h2 style="font-weight: bold; margin-bottom: 1rem;">Configuration Error</h2>
      <p>Missing <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> in your .env file.</p>
      <p style="margin-top: 1rem; color: #555;">Please make sure the frontend server was restarted after creating the .env file.</p>
    </div>
  `;
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
