import ReactDom from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowseRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <StrictMode>

    <BrowseRouter >

      <App />

    </BrowseRouter>


  </StrictMode>,
)
