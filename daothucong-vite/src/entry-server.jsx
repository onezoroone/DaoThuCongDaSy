import React from 'react'
import ReactDOMServer from 'react-dom/server'
import SSRLayout from './Components/Layouts/SSRLayout.jsx';
export async function render() {
  const head = ReactDOMServer.renderToString(
      <React.StrictMode>
        <SSRLayout />
      </React.StrictMode>
  )
  return { head }
}
