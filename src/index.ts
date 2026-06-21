#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(here, "..", "package.json"), "utf8"),
) as { version: string; name: string };

// Distinctive UA so Apify run meta.userAgent marks MCP-originated runs.
const USER_AGENT = `mambalabs-mcp ${pkg.name}@${pkg.version}`;

const APIFY_TOKEN = process.env.APIFY_TOKEN;

type ToolResult = {
  isError?: boolean;
  content: Array<{ type: "text"; text: string }>;
};

// Drop undefined values so optional inputs are not sent to the actor.
function compact(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

// The actor validates its input schema before running, and types
// includeFollowerCounts and skipCache as strings ("true"/"false") for Clay
// compatibility. We expose them as booleans to the model for a cleaner tool
// surface, then coerce to the string form the actor accepts. Returns undefined
// for an undefined flag so it stays out of the request body entirely.
function boolToString(v: boolean | undefined): string | undefined {
  return v === undefined ? undefined : v ? "true" : "false";
}

// Shared caller. actorPath is the actor's immutable Apify actor ID (a stable
// key that survives Store renames). The /v2/acts/{id} endpoint accepts it
// directly, so a Store rename never breaks these calls.
async function runActor(
  actorPath: string,
  actorLabel: string,
  input: Record<string, unknown>,
): Promise<ToolResult> {
  if (!APIFY_TOKEN) {
    return { isError: true, content: [{ type: "text", text: "APIFY_TOKEN is not set. Create a token at https://console.apify.com/account/integrations and set it as the APIFY_TOKEN environment variable." }] };
  }

  const url = `https://api.apify.com/v2/acts/${actorPath}/run-sync-get-dataset-items?timeout=300`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${APIFY_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify(input),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { isError: true, content: [{ type: "text", text: `Could not reach the Apify API: ${message}` }] };
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body?.error?.message) detail = ` ${body.error.message}`;
    } catch {
      detail = "";
    }

    let message: string;
    switch (response.status) {
      case 401:
        message = "Invalid Apify token. Check your APIFY_TOKEN environment variable.";
        break;
      case 402:
        message =
          "Insufficient Apify credits. Check your account balance at https://console.apify.com/billing";
        break;
      case 408:
        message = `The ${actorLabel} run timed out after 300 seconds. Try again, or run the actor on Apify directly for longer jobs.`;
        break;
      default:
        message = `Apify request to ${actorLabel} failed with status ${response.status}.${detail}`;
    }
    return { isError: true, content: [{ type: "text", text: message }] };
  }

  const items = await response.json();
  return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
}

const server = new McpServer({
  name: "mamba-company-social-presence-mapper",
  version: pkg.version,
});

// Company Social Presence Mapper (immutable actor ID 4k6CCemkgBDz18m2h)
server.registerTool(
  "map_company_social_presence",
  {
    title: "Map Company Social Presence",
    description:
      "Map a company's social media presence across LinkedIn, X, Instagram, Facebook, and YouTube. Returns profile URLs and follower counts in flat Clay-ready JSON. Profiles are discovered from the company's own homepage links, a web search fallback, and pattern guessing, then validated against the company. Follower counts are extracted where public; X is URL-only (its count needs login) and Instagram and Facebook counts are best-effort. Read-only; requires an APIFY_TOKEN and consumes Apify credits per call.",
    annotations: {
      title: "Map Company Social Presence",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    inputSchema: {
      company_domain: z
        .string()
        .optional()
        .describe("Bare company domain, e.g. stripe.com. Provide this or company_name."),
      company_name: z
        .string()
        .optional()
        .describe("Optional company name. Improves search accuracy and disambiguation. Provide this or company_domain."),
      platforms: z
        .array(z.enum(["linkedin", "x", "instagram", "facebook", "youtube"]))
        .optional()
        .describe("Which platforms to map. Defaults to all five."),
      includeFollowerCounts: z
        .boolean()
        .optional()
        .describe("Fetch profile pages to extract follower counts (default true). Set false for URLs only, which is cheaper."),
      skipCache: z
        .boolean()
        .optional()
        .describe("Force a fresh lookup and ignore the 7 day result cache."),
    },
  },
  async ({ company_domain, company_name, platforms, includeFollowerCounts, skipCache }) => {
    if (
      (company_domain === undefined || company_domain === "") &&
      (company_name === undefined || company_name === "")
    ) {
      return {
        isError: true,
        content: [{ type: "text", text: "Provide at least one of company_domain or company_name." }],
      };
    }
    return runActor(
      "4k6CCemkgBDz18m2h",
      "Company Social Presence Mapper",
      compact({
        company_domain,
        company_name,
        platforms,
        includeFollowerCounts: boolToString(includeFollowerCounts),
        skipCache: boolToString(skipCache),
      }),
    );
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
