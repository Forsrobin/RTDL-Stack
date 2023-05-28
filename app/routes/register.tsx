import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { register } from '~/utils/auth.server'
import { db } from '../utils/db.server'
import { createUserSession } from '../utils/session.server'
import * as Z from 'zod'
import { validationAction } from '~/utils/utils'

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

const badRequest = (data: any) => json(data, { status: 400 })

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>()
  return (
    <div className='hero max-w-full'>
      <div className='hero-content gap-20 w-1/2'>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <Form method='post' action='/register'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Username</span>
                </label>
                <input
                  type='text'
                  className={'input input-bordered ' + (actionData?.fieldErrors?.username ? 'input-error' : '')}
                  name='username'
                  placeholder='Robin'
                  defaultValue={actionData?.fields?.username}
                />
                <label className='label'>
                  {actionData?.fieldErrors?.username ? (
                    <span className='label-text' role='alert' id='username-error'>
                      {actionData.fieldErrors.username}
                    </span>
                  ) : null}
                </label>
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input
                  name='password'
                  className={'input input-bordered ' + (actionData?.fieldErrors?.password ? 'input-error' : '')}
                  placeholder='***************'
                  defaultValue={actionData?.fields?.password}
                  type='password'
                />
                <label className='label'>
                  {actionData?.fieldErrors?.password ? (
                    <span className='label-text' role='alert' id='password-error'>
                      {actionData.fieldErrors.password}
                    </span>
                  ) : null}
                </label>
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Confirm Password</span>
                </label>
                <input
                  name='confirmPassword'
                  className={'input input-bordered ' + (actionData?.fieldErrors?.confirmPassword ? 'input-error' : '')}
                  placeholder='***************'
                  defaultValue={actionData?.fields?.confirmPassword}
                  type='password'
                />
                <label className='label'>
                  {actionData?.fieldErrors?.confirmPassword ? (
                    <span className='label-text' role='alert' id='password-error'>
                      {actionData.fieldErrors.confirmPassword}
                    </span>
                  ) : null}
                </label>
              </div>
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
