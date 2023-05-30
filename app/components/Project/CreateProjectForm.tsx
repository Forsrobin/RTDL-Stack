import type { FC } from 'react'

interface CreateProjectFormProps {}

const CreateProjectForm: FC<CreateProjectFormProps> = ({}) => {
  return (
    <>
      <h2 className='mb-5 text-5xl'>Create project!</h2>
      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>Project name</span>
        </label>
        <input type='text' placeholder='ShopSpy' className='input input-bordered w-full max-w-xs' />
        <label className='label'>
          <span className='label-text'>Users</span>
        </label>
        <input type='text' placeholder='ShopSpy' className='input input-bordered w-full max-w-xs' />
      </div>
    </>
  )
}

export default CreateProjectForm
