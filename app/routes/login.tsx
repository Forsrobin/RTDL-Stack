import Input from '@app/components/Input'
import { login } from '@app/utils/auth.server'
import { createUserSession, getUser } from '@app/utils/session.server'
import { badRequest, validationAction } from '@app/utils/utils'
import type { ActionArgs, ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import * as Z from 'zod'

const loginScema = Z.object({
  username: Z.string({ required_error: 'Username is required' }).nonempty('Username cannot be empty'),
  password: Z.string({ required_error: 'Password is required' }).nonempty('Password cannot be empty')
})
type ActionInput = Z.TypeOf<typeof loginScema>

export const loader: LoaderFunction = async ({ request }) => {
  // If the user is already logged in, redirect them to the home page
  const user = await getUser(request)
  if (user) {
    return redirect('/')
  }
  return json({})
}

export const action = async ({ request }: ActionArgs) => {
  const { formData, errors } = await validationAction<ActionInput>({ request, schema: loginScema })

  if (errors) {
    return await badRequest<ActionInput>({
      fieldErrors: errors,
      fields: formData
    })
  }

  const { username, password } = formData
  const fields = formData
  const user = await login({ username, password })

  if (!user) {
    return await badRequest({
      formError: `Username/Password combination is incorrect`,
      fields: fields
    })
  }

  return createUserSession(user.id, '/')
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>()

  return (
    <div className='hero max-w-full'>
      <div className='hero-content gap-20 flex-col lg:flex-row-reverse'>
        <div className='text-center w-1/4 lg:text-left'>
          <h1 className='text-5xl font-bold'>Login now!</h1>
          <p className='py-6'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
            id nisi.
          </p>
        </div>
        <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <div className='card-body'>
            <Form method='post' action='/login'>
              <Input
                type='test'
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
              <label className='label'>
                <a href='#' className='label-text-alt link link-hover'>
                  Forgot password?
                </a>
              </label>
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
                    Login
                  </button>
                </div>
                <div className='divider'>OR</div>
                <div className='form-control'>
                  <Link to={'/register'} className='btn  btn-outline '>
                    Register
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
