import { getUser } from '@app/utils/session.server'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { FC } from 'react'

interface UserIconNavProps {}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  if (!user) {
    return redirect('/')
  }

  return json({
    user
  })
}

const UserIconNav: FC<UserIconNavProps> = ({}) => {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex={0} className='btn btn-ghost btn-circle avatar online placeholder'>
        <div className='bg-base-100 rounded-full w-16 text-base-content'>
          <span className='text-xl'>{user.username[0].toUpperCase()}</span>
        </div>
      </label>
      <ul tabIndex={0} className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 text-base-content'>
        <li>
          <a className='justify-between'>
            Profile
            <span className='badge'>New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <form action='/logout' method='post'>
          <li>
            <button type='submit' className='button'>
              Logout
            </button>
          </li>
        </form>
      </ul>
    </div>
  )
}

export default UserIconNav
