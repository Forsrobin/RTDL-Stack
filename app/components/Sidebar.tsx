import { Link } from '@remix-run/react'
import { AiOutlineHome, AiOutlineInfoCircle } from 'react-icons/ai'

interface SidebarProps {
  displaySidebar: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ displaySidebar }) => {
  const sidebarWidth = displaySidebar ? 'w-96' : 'w-0'

  return (
    <div className={`sidebar ${sidebarWidth} shadow-xl transition-all  overflow-hidden `}>
      <ul className='menu bg-base-100 flex grow mt-5'>
        <li className=''>
          <Link to={'/'}>
            <AiOutlineHome className=' text-xl' />
            Home
          </Link>
        </li>
        <li>
          <Link to={'/about'}>
            <AiOutlineInfoCircle className=' text-xl' />
            About
          </Link>
        </li>
      </ul>
    </div>
  )
}
