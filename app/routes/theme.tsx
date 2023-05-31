import { userPrefs } from '@app/cookies'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

export async function action({ request, params }: ActionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const bodyParams = await request.formData()
  const theme = bodyParams.get('theme')
  cookie.theme = theme

  return redirect(request.headers.get('Referer') || '/', {
    headers: {
      'Set-Cookie': await userPrefs.serialize(cookie)
    }
  })
}
