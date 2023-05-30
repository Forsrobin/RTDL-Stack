import { Link } from '@remix-run/react'
import type { FC } from 'react'

interface CreateProjectProps {
 
}

const CreateProject: FC<CreateProjectProps> = ({}) => {


 return <div className='p-10 flex flex-col grow justify-left'>
   <h2>Create project!</h2>
   <Link to='about'>Why?</Link>
 </div>

}

export default CreateProject
