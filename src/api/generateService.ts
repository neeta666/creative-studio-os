// Frontend service for AI generation.
// Calls the Vercel serverless function — never touches the API key directly.

export interface GenerateRequest {
  topic:         string
  persona?:      string
  content_type?: string
  tone?:         string
  length?:       string
  keywords?:     string
}

export interface Variant {
  title:      string
  content:    string
  word_count: number
}

export async function generateVariants(req: GenerateRequest): Promise<Variant[]> {
  const response = await fetch('/api/generate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(req),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error ?? `Request failed with status ${response.status}`)
  }

  const data = await response.json()
  return data.variants as Variant[]
}
