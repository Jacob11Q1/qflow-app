import Anthropic from '@anthropic-ai/sdk'

// Lazily instantiate so the server can boot without a key during early dev.
let client = null

function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

// Default to the latest Sonnet for general-purpose generation.
export const DEFAULT_MODEL = 'claude-sonnet-4-6'

/**
 * generateProposal — turn a short brief into structured proposal copy.
 * @param {string} brief
 * @returns {Promise<string>}
 */
export async function generateProposal(brief) {
  const message = await getClient().messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1500,
    system:
      'You are QFLOW, an assistant that writes clear, scoped, well-priced ' +
      'project proposals for freelance web developers.',
    messages: [{ role: 'user', content: `Draft a proposal for: ${brief}` }],
  })

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
}
