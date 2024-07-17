import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import { QueryProvider } from './lib/react-query/QueryProvider.jsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <QueryProvider>
      <AuthProvider>
          <App/>
        </AuthProvider>
      </QueryProvider> 
    </BrowserRouter>  
  );
} else {
  console.error('Root element not found');
}