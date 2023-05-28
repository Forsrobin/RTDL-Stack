import { Link } from '@remix-run/react'

interface SidebarProps {
  displaySidebar: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ displaySidebar }) => {
  const sidebarWidth = displaySidebar ? 'w-60' : 'w-0'

  return (
    <div className={`sidebar ${sidebarWidth} shadow-xl transition-all h-full overflow-hidden`}>
      <ul className='menu menu-compact bg-base-100 rounded-box'>
        <li>
          <Link to={'/'}>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Home
          </Link>
        </li>
        <li>
          <Link to={'/about'}>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            About
          </Link>
        </li>
      </ul>
    </div>
  )
}
