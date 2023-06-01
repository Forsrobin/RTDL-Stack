import Input from '@app/components/Input'
import { register } from '@app/utils/auth.server'
import { db } from '@app/utils/db.server'
import { badRequest, validationAction } from '@app/utils/utils.server'
import type { ActionFunction } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import * as Z from 'zod'
import { createUserSession } from '../utils/session.server'

const registerScema = Z.object({
  username: Z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .nonempty('Username cannot be empty'),
  password: Z.string({ description: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  confirmPassword: Z.string().nonempty('Username cannot be empty')
})
type ActionInput = Z.TypeOf<typeof registerScema>

export const action: ActionFunction = async ({ request }) => {
  const { formData, errors } = await validationAction<ActionInput>({ request, schema: registerScema })

  if (errors) {
    return badRequest({
      fieldErrors: errors,
      fields: formData
    })
  }

  const { username, password, confirmPassword } = formData

  // Check if passwords match
  if (password !== confirmPassword) {
    return badRequest({
      fields: formData,
      formError: `Passwords do not match.`
    })
  }

  const userExists = await db.user.findFirst({
    where: { username }
  })

  if (userExists) {
    return badRequest({
      fields: formData,
      formError: `User with username ${username} already exists`
    })
  }

  const user = await register({ username, password })

  if (!user) {
    return badRequest({
      fields: formData,
      formError: `Something went wrong trying to create a new user.`
    })
  }

  return createUserSession(user.id, '/')
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>()
  return (
    <div className='hero max-w-full items-start md:items-center flex'>
      <div className='hero-content grow gap-10 mt-5 md:mt-0 md:gap-20 flex-col lg:flex-row-reverse'>
        <div className='text-center block md:hidden w-full md:w-1/4 lg:text-lef'>
          <h1 className='text-5xl font-bold'>Register!</h1>
        </div>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <Form method='post' action='/register'>
              <Input
                type='text'
                formLabel='Username'
                formName='username'
                placeholder='Robin'
                fieldError={actionData?.fieldErrors?.username}
                field={actionData?.fields?.username}
              />
              <Input
                type='password'
                formLabel='Password'
                formName='password'
                showPasswordOption={true}
                placeholder='***************'
                fieldError={actionData?.fieldErrors?.password}
                field={actionData?.fields?.password}
              />
              <Input
                type='password'
                formLabel='Confirm Password'
                formName='confirmPassword'
                placeholder='***************'
                fieldError={actionData?.fieldErrors?.confirmPassword}
                field={actionData?.fields?.confirmPassword}
              />
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
              <div className='flex flex-col w-full border-opacity-50'>
                <div className='form-control mt-6'>
                  <button className='btn btn-primary' type='submit'>
                    Register
                  </button>
                </div>
                <section className='mt-5'>
                  <p>
                    Already have an account,{' '}
                    <Link to={`/login`} className='link link-hover link-primary'>
                      Login
                    </Link>{' '}
                    here?
                  </p>
                </section>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
