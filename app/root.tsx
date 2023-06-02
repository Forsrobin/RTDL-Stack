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
import Loading from './components/Loading'
import { globalContants } from './utils/constants'

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
  const [displaySidebar, setDisplaySidebar] = useState<boolean | undefined>(undefined)
  const { user } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!outerWidth) return
    if (outerWidth < globalContants.md) {
      setDisplaySidebar(false)
    } else {
      setDisplaySidebar(true)
    }
  }, [outerWidth])

  return (
    <div className='w-full h-screen flex flex-col'>
      <Navbar setDisplaySidebar={setDisplaySidebar} displaySidebar={displaySidebar} />

      {displaySidebar != undefined ? (
        <div className='flex flex-row grow'>
          <div className='flex'>{user && <Sidebar setDisplaySidebar={setDisplaySidebar} displaySidebar={displaySidebar} />}</div>
          <div className='grow flex bg-base-200 py-20 md:py-0'>{children}</div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}
