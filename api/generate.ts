import type { VercelRequest, VercelResponse } from '@vercel/node'

// ── Types ─────────────────────────────────────────────────────────────────

interface GenerateRequest {
  topic:        string
  persona?:     string
  content_type?: string
  tone?:        string
  length?:      string
  keywords?:    string
}

interface Variant {
  title:      string
  content:    string
  word_count: number
}

// ── Azure config — values come from Vercel environment variables ───────────
// Set these in: Vercel dashboard → Project → Settings → Environment Variables
// NEVER hardcode these values here.

const AZURE_ENDPOINT   = 'https://gpt5-azureai.openai.azure.com'
const AZURE_DEPLOYMENT = 'gpt-5.4'
const AZURE_API_VERSION = '2025-01-01-preview'
const AZURE_URL = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`

// ── Prompt builder ────────────────────────────────────────────────────────

function buildPrompt(req: GenerateRequest): string {
  const parts = [
    `Topic: ${req.topic}`,
    req.persona      ? `Brand persona: ${req.persona}`           : '',
    req.content_type ? `Content type: ${req.content_type}`       : '',
    req.tone         ? `Tone: ${req.tone}`                       : '',
    req.length       ? `Length preference: ${req.length}`        : '',
    req.keywords     ? `Keywords to include: ${req.keywords}`    : '',
  ].filter(Boolean).join('\n')

  return `You are a professional content writer. Generate exactly 3 distinct content variations for the following brief.

${parts}

Return a JSON array with exactly 3 objects. Each object must have:
- "title": a clear, engaging headline
- "content": 2-4 short paragraphs of natural, readable copy relevant to the topic
- "word_count": integer word count of the content field

Return only the raw JSON array. No markdown, no explanation, no code fences.`
}

// ── Handler ───────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.AZURE_OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const body = req.body as GenerateRequest

  if (!body?.topic) {
    return res.status(400).json({ error: 'topic is required' })
  }

  try {
    const azureResponse = await fetch(AZURE_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'api-key':       apiKey,          // Azure uses api-key header, not Bearer
      },
      body: JSON.stringify({
        messages: [
          {
            role:    'user',
            content: buildPrompt(body),
          },
        ],
        temperature: 0.7,
        max_tokens:  1500,
      }),
    })

    if (!azureResponse.ok) {
      const err = await azureResponse.text()
      console.error('Azure error:', err)
      return res.status(502).json({ error: 'AI service error' })
    }

    const azureData = await azureResponse.json()
    const rawText   = azureData.choices?.[0]?.message?.content ?? ''

    // Parse the JSON array returned by the model
    let variants: Variant[]
    try {
      variants = JSON.parse(rawText)
    } catch {
      console.error('Failed to parse model output:', rawText)
      return res.status(502).json({ error: 'Invalid response from AI service' })
    }

    // Ensure exactly 3 variants with the expected shape
    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(502).json({ error: 'Unexpected response shape from AI service' })
    }

    return res.status(200).json({ variants: variants.slice(0, 3) })

  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
