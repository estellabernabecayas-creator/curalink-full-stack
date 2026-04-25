import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#721c24',
          fontSize: '18px'
        }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }

    return (
      <BrowserRouter>
        <ThemeProvider>
          <AppContextProvider>
            {this.props.children}
          </AppContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
