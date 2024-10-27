import React from 'react'
import ReactDOM from 'react-dom/client'
import NoiseMaker from './NoiseMaker.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NoiseMaker />
  </React.StrictMode>,
)
