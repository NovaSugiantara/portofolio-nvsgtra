import { createError, getRouterParam, readBody, type H3Event } from 'h3'
import { z } from 'zod'

const routeUuidSchema = z.uuid()

type AdminDatabaseError = {
  code?: string | null
}

export const getAdminRouteUuid = (event: H3Event): string => {
  const result = routeUuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid resource id' })
  }

  return result.data
}

export const readAdminBody = async <T>(
  event: H3Event,
  schema: z.ZodType<T>,
): Promise<T> => {
  let body: unknown
  try {
    body = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  return result.data
}

export const readAdminPatch = async <T extends object>(
  event: H3Event,
  schema: z.ZodType<T>,
): Promise<T> => {
  const body = await readAdminBody(event, schema)
  if (Object.keys(body).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Request body cannot be empty' })
  }

  return body
}

export const throwAdminNotFound = (resource = 'Resource'): never => {
  throw createError({ statusCode: 404, statusMessage: `${resource} not found` })
}

export const throwAdminDatabaseError = (error: AdminDatabaseError): never => {
  switch (error.code) {
    case '23505':
      throw createError({ statusCode: 409, statusMessage: 'Resource already exists' })
    case '23503':
      throw createError({ statusCode: 400, statusMessage: 'Invalid related resource' })
    case '42501':
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    case 'PGRST116':
      throwAdminNotFound()
    default:
      throw createError({ statusCode: 500, statusMessage: 'Database operation failed' })
  }
}
