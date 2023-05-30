import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { db } from '../utils/db.server'
import { getUser, requireUserId } from '../utils/session.server'

export const action = async ({ request }: ActionArgs) => {
  // GEt the user ID
  const userId = await requireUserId(request)

  const form = await request.formData()
  const by = form.get('by')
  const quote = form.get('quote')

  if (typeof by !== 'string' || by === '' || typeof quote !== 'string' || quote === '') {
    redirect('/new-quote')
    throw new Error(`Form not submitted correctly.`)
  }

  const fields = { by, quote }

  await db.quote.create({ data: { ...fields, userId: userId } })
  return redirect('/')
}

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg text-purple-900 outline-purple-300 `
export default function NewQuoteRoute() {
  return (
    <>
      <div className='flex justify-center items-center content-center'>
        <div className='lg:m-10 my-10 md:w-2/3 lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300  font-bold px-5 py-6 rounded-md'>
          <form method='post'>
            <label className='text-lg leading-7 text-white'>
              Quote Master (Quote By):
              <input type='text' className={inputClassName} name='by' required />
            </label>
            <label className='text-lg leading-7 text-white'>
              Quote Content:
              <textarea required className={`${inputClassName} resize-none `} id='' cols={30} rows={10} name='quote'></textarea>
            </label>
            <button className='btn w-64' type='submit'>
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
