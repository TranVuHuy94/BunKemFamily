import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Find or create the root element
let rootElement = document.getElementById('root')
if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    // Ensure it's behind everything
    rootElement.style.position = 'fixed'
    rootElement.style.top = '0'
    rootElement.style.left = '0'
    rootElement.style.width = '100%'
    rootElement.style.height = '100%'
    rootElement.style.zIndex = '-1'
    rootElement.style.pointerEvents = 'none'
    document.body.prepend(rootElement)
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
