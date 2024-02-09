import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './router.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import SSRLayout from './Components/Layouts/SSRLayout.jsx'
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router}>
        <SSRLayout />
      </RouterProvider>
    </ContextProvider>
  </React.StrictMode>
)
