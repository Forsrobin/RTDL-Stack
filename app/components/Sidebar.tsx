import { getUser } from '@app/utils/session.server'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { AiOutlineHome, AiOutlineProject } from 'react-icons/ai'

interface SidebarProps {
  displaySidebar: boolean
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  return json({
    user,
    url: request.url
  })
}

export const Sidebar: React.FC<SidebarProps> = ({ displaySidebar }) => {

  

  const sidebarWidth = displaySidebar ? 'w-80 md:w-60' : 'w-0'

  return (
    <div className='h-full bg-base-100 z-10 fixed md:static transition-all'>
      <div className={`${sidebarWidth} shadow-xl h-full transition-all overflow-hidden `}>
        <ul className='menu p-4 bg-base-100 text-base-content gap-2'>
          <li>
            <Link to={'/'} >
              <AiOutlineHome className=' text-xl' />
              Home
            </Link>
          </li>
          <li>
            <Link to={'/projects'}>
              <AiOutlineProject className=' text-xl' />
              Projects
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
