import { Link } from '@remix-run/react'
import { AiOutlineHome, AiOutlineProject } from 'react-icons/ai'

interface SidebarProps {
  displaySidebar: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ displaySidebar }) => {
  const sidebarWidth = displaySidebar ? 'w-60' : 'w-0'

  return (
    <div className={`${sidebarWidth}  shadow-xl transition-all overflow-hidden `}>
      <ul className='menu p-4 bg-base-100 text-base-content gap-2'>
        <li className=''>
          <Link to={'/'}>
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
  )
}
