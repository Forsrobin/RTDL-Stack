import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getUser } from '~/utils/session.server'
import { db } from '../utils/db.server'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)
  return json({
    quotes: await db.quote.findMany(),
    user
  })
}

export default function Index() {
  const { quotes } = useLoaderData<typeof loader>()

  return (
    <div className='grid gap-4 grid-cols-2'>
      {quotes.map((q, i) => {
        const { id, quote, by } = q
        return (
          <div key={id}>
            <div className='card bg-primary text-primary-content'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title'>- {by}</h2>
                <p>{quote}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
