import type { FC } from 'react'
import CreateProjectForm from '~/components/Project/CreateProjectForm'

interface CreateProjectProps {}

const CreateProject: FC<CreateProjectProps> = ({}) => {
  return (
    <div className='p-10 flex flex-col grow justify-left'>
      <CreateProjectForm />
    </div>
  )
}

export default CreateProject
