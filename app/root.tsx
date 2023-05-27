import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'

import styles from './styles/app.css'
import { getUser } from './utils/session.server'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'ShopSpy' }, { name: 'ShopSpy', content: 'Landing page for shopSpy!' }]
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  return json({
    user
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

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
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

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>()

  return (
    <>
      <nav className='navbar bg-base-100'>
        <div className='flex-1'>
          <Link className='btn btn-ghost normal-case text-2xl' to={'/'}>
            Test
          </Link>
        </div>
        <div className='flex-none'>
          <ul className='menu menu-horizontal px-1'>
            {user ? (
              <>
                <li>
                  <Link to={'new-quote'}>Quotes</Link>
                </li>
                <li>
                  <form action='/logout' method='post'>
                    <button type='submit' className='button'>
                      Logout
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={'login'}>Login</Link>
                </li>
                <li>
                  <Link to={'register'}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <div>{children}</div>
    </>
  )
}
