import { json } from '@remix-run/node'
import { useEffect } from 'react';
import type { ZodError, ZodSchema } from 'zod'

type ActionError<T> = Partial<Record<keyof T, string>>

export async function validationAction<ActionInput>({ request, schema }: { request: Request; schema: ZodSchema }) {
  const body = Object.fromEntries(await request.formData())

  try {
    const formData = schema.parse(body) as ActionInput

    // Convert FormData to JSON

    return { formData, error: null }
  } catch (e) {
    const errors = e as ZodError<ActionInput>

    return {
      formData: body as ActionInput,
      errors: errors.issues.reduce((acc: ActionError<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput
        acc[key] = curr.message
        return acc
      }, {})
    }
  }
}

interface BadRequest<TData> {
  fields: Partial<Record<keyof TData, string>>
  fieldErrors?: Partial<Record<keyof TData, string>> | undefined
  formError?: string | undefined
}

export async function badRequest<TData>(data: BadRequest<TData>) {
  return json(data, {
    status: 400
  })
}