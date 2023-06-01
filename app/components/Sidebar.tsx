import { getUser } from '@app/utils/session.server'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { AiOutlineHome, AiOutlineProject } from 'react-icons/ai'

interface SidebarProps {
  displaySidebar: boolean
  setDisplaySidebar: (displaySidebar: boolean) => void
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  return json({
    user,
    url: request.url
  })
}

export const Sidebar: React.FC<SidebarProps> = ({ displaySidebar, setDisplaySidebar }) => {
  const sidebarWidth = displaySidebar ? 'w-80 md:w-60' : 'w-0'

  const closeDisplay = () => {
    setDisplaySidebar(!displaySidebar)
  }

  return (
    <div className='h-full bg-base-100 z-10 fixed md:static transition-all shadow-xl'>
      <div className={`${sidebarWidth} h-full transition-all overflow-hidden `}>
        <div className='flex-row items-center bg-base-300 text-base-content flex md:hidden'>
          <button className='rounded-xl p-5' onClick={closeDisplay}>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-5 h-5 stroke-current'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
          <h2>Menu</h2>
        </div>
        <ul className='menu p-4 bg-base-100 text-base-content gap-2'>
          <li>
            <Link to={'/'} onClick={closeDisplay}>
              <AiOutlineHome className=' text-xl' />
              Home
            </Link>
          </li>
          <li>
            <Link to={'/projects'} onClick={closeDisplay}>
              <AiOutlineProject className=' text-xl' />
              Projects
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
