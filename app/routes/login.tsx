import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { login } from '~/utils/auth.server'
import { createUserSession, getUser } from '../utils/session.server'
import * as Z from 'zod'
import { validationAction } from '~/utils/utils'
import Input from '~/components/Input'

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

export const action: ActionFunction = async ({ request }) => {
  const { formData, errors } = await validationAction<ActionInput>({ request, schema: loginScema })

  if (errors) {
    return badRequest({
      fieldErrors: errors,
      fields: formData
    })
  }

  const { username, password } = formData
  const fields = formData
  const user = await login({ username, password })

  if (!user) {
    return badRequest({
      formError: `Username/Password combination is incorrect`,
      fields
    })
  }

  return createUserSession(user.id, '/')
}

const badRequest = (data: any) => json(data, { status: 400 })

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

    // <div className='container bg-accent m-0 p-0'>
    //   <Form method='post' className='form-control w-full max-w-xs bg-primary'>
    //     <h1 className=''>Login</h1>
    //     <label className='label'>
    //       <span className='label-text'>Username</span>
    //     </label>
    //     <input
    //       type='text'
    //       className='input input-bordered w-full max-w-xs'
    //       name='username'
    //       placeholder='Username'
    //       required
    //       minLength={3}
    //       defaultValue={actionData?.fields?.username}
    //       aria-invalid={Boolean(actionData?.fieldErrors?.username)}
    //       aria-errormessage={actionData?.fieldErrors?.username ? 'username-error' : undefined}
    //     />
    //     {/* <label className=''>
    //         Username:
    //         {actionData?.fieldErrors?.username ? (
    //           <p role='alert' id='username-error'>
    //             {actionData.fieldErrors.username}
    //           </p>
    //         ) : null}
    //       </label> */}
    //     <label>
    //       Password
    //       <input
    //         name='password'
    //         className={''}
    //         required
    //         defaultValue={actionData?.fields?.password}
    //         type='password'
    //         aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
    //         aria-errormessage={actionData?.fieldErrors?.password ? 'password-error' : undefined}
    //       />
    //       {actionData?.fieldErrors?.password ? (
    //         <p role='alert' id='password-error'>
    //           {actionData.fieldErrors.password}
    //         </p>
    //       ) : null}
    //     </label>
    //     <div id='form-error-message'>{actionData?.formError ? <p role='alert'>{actionData.formError}</p> : null}</div>
    //     <button type='submit'>Login</button>
    //   </Form>
    // </div>
  )
}
