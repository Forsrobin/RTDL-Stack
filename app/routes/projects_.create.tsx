import Input from '@app/components/Input'
import { createProject } from '@app/services/projects.server'
import { badRequest, validationAction } from '@app/utils/utils'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import type { FC } from 'react'
import * as Z from 'zod'

const createSchema = Z.object({
  name: Z.string({ required_error: 'Project name is required' }).nonempty('Project name can not be emptyy')
})
export type CreateProjectType = Z.TypeOf<typeof createSchema>

export const action = async ({ request }: ActionArgs) => {
  const { formData, errors } = await validationAction<CreateProjectType>({ request, schema: createSchema })

  if (errors) {
    return badRequest<CreateProjectType>({
      fieldErrors: errors,
      fields: formData
    })
  }

  const project = createProject({ request, project: formData })

  if (!project) {
    return badRequest<CreateProjectType>({
      formError: 'Project could not be created',
      fields: formData
    })
  }

  return redirect('/projects', {})
}

const CreateProject: FC = ({}) => {
  const actionData = useActionData<typeof action>()
  
  return (
    <div className='p-10 flex flex-col grow justify-left'>
      <Form method='post' className='form-control w-full max-w-xs'>
        <h2 className='text-3xl'>Project setup</h2>
        <Input
          type='text'
          placeholder='Project name'
          formLabel='Project name'
          formName='name'
          field={actionData?.fields.name}
          fieldError={actionData?.fieldErrors?.name}
        />
        <button className='btn btn-primary mt-5'>Create</button>
        <div id='form-error-message'>
          {actionData?.formError ? (
            <div className='alert alert-error shadow-lg px-2 py-1'>
              <div className='indicator text-white'>
                <svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-6 w-6' fill='none' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <label className='label'>
                  <span className='label-text text-white'>{actionData.formError}</span>
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  )
}

export default CreateProject
