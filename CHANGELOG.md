# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-21

### Added

- Initial release of the Company Social Presence Mapper MCP server.
- `map_company_social_presence` tool: map a company domain to its official
  LinkedIn, X, Instagram, Facebook, and YouTube URLs plus follower counts,
  returned as flat Clay-ready JSON.
- Profile discovery from the company's own homepage links, a web search
  fallback, and pattern guessing, each validated against the company.
- `platforms` input to map a subset of the five platforms.
- `includeFollowerCounts` input to return URLs only when follower counts are
  not needed (cheaper).
- `skipCache` input to force a fresh lookup and bypass the 7 day result cache.
- stdio transport for use with Claude Desktop and other MCP clients.

[1.0.0]: https://github.com/mambalabsdev/mcp-company-social-presence-mapper/releases/tag/v1.0.0
