import axios from 'axios'

function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const record = data as Record<string, unknown>
  const fields = ['message', 'error', 'description']
  for (const field of fields) {
    const value = record[field]
    if (typeof value === 'string') return value
  }
  return undefined
}

export async function httpPost<T>(url: string, body: unknown): Promise<T> {
  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data as T
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err.response?.status ?? 'ERR'
    const msg =
      extractMessage(err.response?.data) || err.message || 'Request failed'
    throw new Error(`Error (${status}): ${msg}`)
  }
}

export async function httpGet<T>(url: string): Promise<T> {
  try {
    const response = await axios.get(url)
    return response.data as T
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err.response?.status ?? 'ERR'
    const body = err.response?.data
    if (typeof body === 'string') {
      throw new Error(body)
    }
    const msg = extractMessage(body) || err.message || 'Request failed'
    throw new Error(`Error (${status}): ${msg}`)
  }
}
