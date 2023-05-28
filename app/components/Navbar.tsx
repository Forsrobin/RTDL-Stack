import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData, useSubmit } from '@remix-run/react';
import { MdColorLens } from 'react-icons/md';
import { userPrefs } from '~/cookies';
import { getUser } from '~/utils/session.server';

interface NavbarProps {
  displaySidebar: boolean
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

  const submit = useSubmit()
  function handleChange(event: any) {
    submit(event.currentTarget, { replace: false })
  }

  return (
    <nav className='navbar bg-primary text-base-300 shadow-sm'>
      <div className='flex-none'>
        <button className='btn btn-square btn-ghost' onClick={() => setDisplaySidebar(!displaySidebar)}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-5 h-5 stroke-current'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
          </svg>
        </button>
      </div>
      <div className='flex-1'>
        <Link className='normal-case text-xl rounded-none ml-4' to={'/'}>
          ShopSpy
        </Link>
      </div>
      <p>{theme}</p>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-5 items-center gap-[5px]'>
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
              <div className='flex justify-end flex-1 px-2'>
                <div className='flex items-stretch'>
                  <div className='dropdown dropdown-end'>
                    <label tabIndex={0} className='btn btn-ghost rounded-btn'>
                      <MdColorLens className='text-3xl' />
                    </label>
                    <ul tabIndex={0} className='menu dropdown-content p-1 shadow bg-base-100 w-auto mt-4 text-neutral'>
                      <Form method='post' action='theme' onChange={handleChange}>
                        <li>
                          <label className='cursor-pointer label'>
                            <input
                              type='radio'
                              name='theme'
                              value='light'
                              checked={theme === 'light'}
                              onChange={() => {}}
                              className='radio radio-primary'
                            />
                            <span className='text-s'>Light</span>
                          </label>
                        </li>
                        <li>
                          <label className='cursor-pointer label'>
                            <input
                              type='radio'
                              name='theme'
                              value='dark'
                              checked={theme === 'dark'}
                              onChange={() => {}}
                              className='radio radio-primary'
                            />
                            <span className='text-s'>Dark</span>
                          </label>
                        </li>
                        <li>
                          <label className='cursor-pointer label'>
                            <input
                              type='radio'
                              name='theme'
                              value='cupcake'
                              checked={theme === 'cupcake'}
                              onChange={() => {}}
                              className='radio radio-primary'
                            />
                            <span className='text-s'>Cupcake</span>
                          </label>
                        </li>
                      </Form>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
