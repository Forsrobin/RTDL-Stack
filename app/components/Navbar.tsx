import { userPrefs } from '@app/cookies'
import { getUser } from '@app/utils/session.server'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import ThemeSelector from './ThemeSelector'
import UserIconNav from './UserIconNav'

interface NavbarProps {
  displaySidebar: boolean | undefined
  setDisplaySidebar: (displaySidebar: boolean) => void
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}

  return json({
    user,
    theme: cookie.theme,
    url: request.url
  })
}

export const Navbar: React.FC<NavbarProps> = ({ setDisplaySidebar, displaySidebar }) => {
  const { user, theme } = useLoaderData<typeof loader>()

  return (
    <nav className='navbar bg-primary text-white shadow-md z-10 gap-5 fixed md:static'>
      <div className='flex-1 ml-3 gap-5'>
        {user && (
          <button className='btn btn-square btn-ghost' onClick={() => setDisplaySidebar(!displaySidebar)}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-5 h-5 stroke-current'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        )}
        <Link className='normal-case text-xl rounded-none' to={'/'}>
          ShopSpy
        </Link>
      </div>
      <div className='flex-none gap-5 mr-5'>
        <ul className='menu menu-horizontal px-1 gap-1'>
          {!user ? (
            <>
              <li>
                <Link to={'login'}>Login</Link>
              </li>
              <li>
                <Link to={'register'}>Register</Link>
              </li>
            </>
          ) : null}
        </ul>
        <ThemeSelector currentTheme={theme} />
        {user && (
          <>
            <input type='text' placeholder='Search' className='input input-bordered hidden md:flex' />
            <UserIconNav />
          </>
        )}
      </div>
    </nav>
  )
}
