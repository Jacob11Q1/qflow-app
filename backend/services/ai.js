const Anthropic = require('@anthropic-ai/sdk')

// Instantiated up front; real calls land in later days. The key may be empty
// during early dev — the mock functions below don't call the API yet.
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Exported so future implementations can use it without re-instantiating.
exports.client = client

async function generateProposal(data) {
  // Full implementation Day 9.
  // For now return a mock proposal structure.
  return {
    executiveSummary: 'Mock proposal - AI coming Day 9',
    pricing: { recommended: { price: 2000 } },
  }
}

async function detectScopeCreep(scope, message) {
  // Full implementation Day 11.
  return { isOutOfScope: false, confidence: 0 }
}

module.exports = { client, generateProposal, detectScopeCreep }
