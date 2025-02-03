import React from 'react'
import ReactDOM from 'react-dom/client'
import NetworkInfo from './components/NetworkInfo' // Make sure this path is correct
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NetworkInfo />
  </React.StrictMode>
)