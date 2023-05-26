import type { V2_MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import { db } from '../utils/db.server'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async () => {
  return json({
    quotes: await db.quote.findMany()
  })
}

export default function Index() {
  const { quotes } = useLoaderData<typeof loader>()

  return (
    <div>
      <nav className='bg-gradient-to-br from-red-400 via-red-500 to-red-500 w-full fixed top-0 left-0 px-5'>
        <div className='w-full max-w-screen-lg mx-auto flex justify-between content-center py-3 '>
          <Link className='text-white text-3xl font-bold' to={'/'}>
            Quote Wall
          </Link>
          <div className='flex flex-col md:flex-row items-center justify-between gap-x-4 text-blue-50'>
            <Link to={'login'}>Login</Link>
            <Link to={'login'}>Register</Link>

            <Link to={'new-quote'}>Add A Quote</Link>
            <Link to={'logout'}>Logout</Link>
          </div>
        </div>
      </nav>

      <div className='grid lg:grid-flow-row grid-cols-1 lg:grid-cols-3'>
        {quotes.map((q, i) => {
          const { id, quote, by } = q
          return (
            <figure key={id} className='m-4 py-10 px-4 shadow-md shadow-black-100'>
              <blockquote className='py-3'>
                <p className='text-gray-800  text-xl'>{quote}</p>
              </blockquote>
              <figcaption>
                <cite className='text-gray-600 text-md mb-4 text-right'>- {by}</cite>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
