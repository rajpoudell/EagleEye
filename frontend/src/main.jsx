import React ,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CameraProvider } from './Context/CameraContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CameraProvider>
      <App />
    </CameraProvider>
  </StrictMode>,
)
