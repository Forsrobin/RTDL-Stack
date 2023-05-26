import { Links, LiveReload, Meta, Outlet } from '@remix-run/react'
import type { V2_MetaFunction } from '@remix-run/node'

import styles from './styles/app.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='bg-white relative px-5'>
        <div className='mt-20 w-full max-w-screen-lg mx-auto'>
          <Outlet />
        </div>
        <LiveReload />
      </body>
    </html>
  )
}
