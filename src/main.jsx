import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Apply saved theme before first render to prevent flash
import { getSavedTheme, resolveTheme, applyTheme } from './utils/theme.js'
applyTheme(resolveTheme(getSavedTheme()));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
