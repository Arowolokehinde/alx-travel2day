import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer
          theme="light"
          position='top-center'
          autoClose={5000}
          closeOnClick={true}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          toastClassName=".toast-message"
        />
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
