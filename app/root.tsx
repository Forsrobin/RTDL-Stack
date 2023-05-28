import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'

import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import styles from './styles/app.css'
import { getUser } from './utils/session.server'
import { userPrefs } from './cookies'

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'ShopSpy' }, { name: 'ShopSpy', content: 'Landing page for shopSpy!' }]
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  return json({
    user,
    theme: cookie.theme
  })
}

export default function App() {
  return (
    <Document>
      <ScrollRestoration />
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

const Document = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useLoaderData<typeof loader>()

  return (
    <html lang='en' data-theme={theme}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [displaySidebar, setDisplaySidebar] = useState(true)
  const { user } = useLoaderData<typeof loader>()
  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar setDisplaySidebar={setDisplaySidebar} displaySidebar={displaySidebar} />
      <div className='flex flex-row grow'>
        {user && <Sidebar displaySidebar={displaySidebar} />}
        <div className='grow flex bg-base-200'>{children}</div>
      </div>
    </div>
  )
}
