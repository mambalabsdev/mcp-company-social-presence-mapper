# Company Social Presence Mapper MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-company-social-presence-mapper)](https://smithery.ai/servers/mambabuilt/mcp-company-social-presence-mapper) [![Glama score](https://glama.ai/mcp/servers/mambalabsdev/mcp-company-social-presence-mapper/badges/score.svg)](https://glama.ai/mcp/servers/mambalabsdev/mcp-company-social-presence-mapper) [![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0%2Fservers%3Fsearch%3Dcom.mambabuilt%252Fmcp-company-social-presence-mapper%26limit%3D1&query=%24.servers%5B0%5D._meta%5B%22io.modelcontextprotocol.registry%2Fofficial%22%5D.status&label=mcp%20registry&color=blue)](https://registry.modelcontextprotocol.io/v0/servers?search=com.mambabuilt/mcp-company-social-presence-mapper&limit=1) [![npm version](https://img.shields.io/npm/v/@mambalabsdev/mcp-company-social-presence-mapper)](https://www.npmjs.com/package/@mambalabsdev/mcp-company-social-presence-mapper) [![npm downloads](https://img.shields.io/npm/dm/@mambalabsdev/mcp-company-social-presence-mapper)](https://www.npmjs.com/package/@mambalabsdev/mcp-company-social-presence-mapper) [![license](https://img.shields.io/github/license/mambalabsdev/mcp-company-social-presence-mapper)](https://github.com/mambalabsdev/mcp-company-social-presence-mapper/blob/main/LICENSE) [![mcpservers.org](https://img.shields.io/badge/mcpservers.org-listed-blue)](https://mcpservers.org/servers/mambalabsdev/mcp-company-social-presence-mapper)

An MCP server that exposes the Mamba Labs Company Social Presence Mapper as a single tool. Install one package and give your MCP client a way to turn a company domain into its official social media URLs and follower counts, wrapping the Mamba Labs actor on Apify and returning Clay-ready flat JSON.

## What it does

This server gives an AI client one tool:

- `map_company_social_presence`: map a company domain to its official LinkedIn, X, Instagram, Facebook, and YouTube URLs plus follower counts. Profiles are discovered from the company's own homepage links, a web search fallback, and pattern guessing, then validated against the company. Follower counts are extracted where public.

All of the work runs on Apify. This package is a thin client that routes the tool call to the actor and hands back the result.

## Quick start

You need Node.js 18 or newer and an Apify account with an API token.

Add this to your Claude Desktop config:

```json
{
  "mcpServers": {
    "company-social-presence-mapper": {
      "command": "npx",
      "args": ["-y", "@mambalabsdev/mcp-company-social-presence-mapper"],
      "env": {
        "APIFY_TOKEN": "your-apify-token"
      }
    }
  }
}
```

Get your token at https://console.apify.com/account/integrations, paste it in, and restart Claude Desktop. The tool will be available.

## Prerequisites

- Node.js 18 or newer
- An Apify account with an API token

## Example prompts

- "Map the social presence of stripe.com across LinkedIn, X, Instagram, Facebook, and YouTube."
- "Find the official social profiles and follower counts for gitlab.com."
- "What are Notion's LinkedIn and YouTube follower counts?"
- "Map only the LinkedIn and X profiles for twilio.com."

## Tool and inputs

`map_company_social_presence`:

- `company_domain` (string): bare company domain, e.g. stripe.com. Provide this or `company_name`.
- `company_name` (string): optional company name. Improves search accuracy and disambiguation. Provide this or `company_domain`.
- `platforms` (array): which platforms to map, any of `linkedin`, `x`, `instagram`, `facebook`, `youtube`. Defaults to all five.
- `includeFollowerCounts` (boolean): fetch profile pages to extract follower counts (default true). Set false for URLs only, which is cheaper.
- `skipCache` (boolean): force a fresh lookup and ignore the 7 day result cache.

Notes on coverage: X / Twitter returns the profile URL only; its follower count requires authentication, which this server does not use. Instagram and Facebook follower counts are best-effort and may be null when the page hides them.

## Full actor documentation

For the complete input and output reference, pricing, and run history, see the Company Social Presence Mapper actor on the Apify Store (canonical immutable Actor ID URL):

https://apify.com/mambalabs/4k6CCemkgBDz18m2h

---

## Mamba Labs GTM Suite

This server is part of the **Mamba Labs GTM Suite**, a fleet of twelve specialized MCP servers for go-to-market signal intelligence, each backed by a dedicated Apify actor.

| Actor | Immutable Actor ID |
|---|---|
| [GTM Hiring Signal Scraper](https://console.apify.com/actors/D7O1SA2EqwHGsGr1P) | `D7O1SA2EqwHGsGr1P` |
| [GTM Tech Stack Signal Enrichment](https://console.apify.com/actors/qyd7nNyqFPelQViBx) | `qyd7nNyqFPelQViBx` |
| [GTM Signals Aggregator](https://console.apify.com/actors/xKdRfnfFNkdMpFuNs) | `xKdRfnfFNkdMpFuNs` |
| [Job Board Keyword Signal Scanner](https://console.apify.com/actors/4DvqpvhMR74NLcDDY) | `4DvqpvhMR74NLcDDY` |
| [Domain to LinkedIn URL Resolver](https://console.apify.com/actors/3HtnSaqPHOg1Qg5gx) | `3HtnSaqPHOg1Qg5gx` |
| [ICP Fit Scorer](https://console.apify.com/actors/W161DT8W4kW55dMFh) | `W161DT8W4kW55dMFh` |
| [Domain Deliverability Checker](https://console.apify.com/actors/0tVgxI7A6o9jMlxmc) | `0tVgxI7A6o9jMlxmc` |
| [Company Firmographic Enricher](https://console.apify.com/actors/YlUtLWjfPpqykmB8g) | `YlUtLWjfPpqykmB8g` |
| [Company Social Presence Mapper](https://console.apify.com/actors/4k6CCemkgBDz18m2h) | `4k6CCemkgBDz18m2h` |
| [Company Identity Resolver](https://console.apify.com/actors/lr8fTRAmZCBZmuwwh) | `lr8fTRAmZCBZmuwwh` |
| [Company Change-Event Feed](https://console.apify.com/actors/oX44rS0fkEJ3rXLWe) | `oX44rS0fkEJ3rXLWe` |
| [Funding & Press Signal Scanner](https://console.apify.com/actors/FS13X6dhQVgX3XOM6) | `FS13X6dhQVgX3XOM6` |

> Built by [Mamba Labs](https://github.com/mambalabsdev) | [npm](https://www.npmjs.com/org/mambalabsdev) | [Apify Store](https://apify.com/mambalabs)

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
