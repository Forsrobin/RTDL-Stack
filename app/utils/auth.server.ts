import bcrypt from 'bcryptjs'
import { db } from './db.server'
import { redirect } from '@remix-run/node'
import { getUserSession, storage } from './session.server'

export type LoginForm = {
  username: string
  password: string
}

export async function register({ username, password }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { username, passwordHash }
  })
  return { id: user.id, username }
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username }
  })
  if (!user) return null
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null
  return { id: user.id, username }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}
