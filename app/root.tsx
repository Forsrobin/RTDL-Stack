import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'

import { Navbar } from '@app/components/Navbar'
import useWindowSize from '@rooks/use-window-size'
import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { userPrefs } from './cookies'
import styles from './styles/app.css'
import { getUser } from './utils/session.server'

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
        <ScrollRestoration />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { outerWidth } = useWindowSize()
  const [displaySidebar, setDisplaySidebar] = useState<boolean>(true)
  const { user } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!outerWidth) return
    if (outerWidth < 750) {
      setDisplaySidebar(false)
    } else {
      setDisplaySidebar(true)
    }
  }, [outerWidth])

  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar setDisplaySidebar={setDisplaySidebar} displaySidebar={displaySidebar} />
      <div className='flex flex-row grow'>
        {user && displaySidebar && <Sidebar displaySidebar={displaySidebar} />}
        <div className='grow flex bg-base-200'>{children}</div>
      </div>

      {user && (
        <div className='fixed bottom-5 flex w-full md:hidden z-10'>
          <button className='bg-base-100 mx-auto p-5 rounded-xl shadow-xl' onClick={() => setDisplaySidebar(!displaySidebar)}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-5 h-5 stroke-current'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
