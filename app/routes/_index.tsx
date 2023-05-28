import { ActionArgs, V2_MetaFunction, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { getUser } from '~/utils/session.server'
import { db } from '../utils/db.server'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }

  return json({
    quotes: await db.quote.findMany(),
    user
  })
}

const Index = () => {
  // Load the quotes from the loader
  const { quotes } = useLoaderData<typeof loader>()

  return (
    <div>
      <Outlet />
      <div className='grid gap-10 grid-cols-2 p-10'>
        {quotes.map((q, i) => {
          const { id, quote, by } = q
          return (
            <div key={id} className='card bg-primary text-focus bg-white shadow-sm'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title'>- {by}</h2>
                <p className='text-neutral-focus'>{quote}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Index
