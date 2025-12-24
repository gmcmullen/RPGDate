# Changes

## Blocking Search Engines & AI Crawlers
- Added `<meta name="robots" content="noindex, nofollow" />` to index.html
- Added meta tags for Google-specific crawlers including Google-Extended (used for AI training)
- Added robots.txt with blocks for:
  - All general crawlers
  - GPTBot (OpenAI)
  - ChatGPT-User
  - CCBot (Common Crawl, used by many AI companies)
  - anthropic-ai / Claude-Web (Anthropic)
  - Google-Extended (Google's AI training crawler)
  - PerplexityBot
  - Omgilibot
  - FacebookBot

These changes prevent both search indexing and AI training data collection. Takes effect on next deployment with `npm run deploy`.
