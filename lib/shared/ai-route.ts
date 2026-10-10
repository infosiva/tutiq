// VENDORED from design-system/ai-route.ts — keep in sync (hub theme.ai overrides registry).
import reg from "./models.json";

export interface SiteAI {
  freeOnly?: boolean;      // default true
  disabled?: string[];     // providers to skip for this site
  chains?: Record<string, string[]>; // per-task chain override
}

/** Ordered provider ids to try for a task. Hub theme.ai overrides registry; missing env keys and paid tiers are dropped. */
export function routeChain(
  task: string,
  site: SiteAI | null | undefined,
  env: Record<string, string | undefined> = process.env,
): string[] {
  const t = (reg.tasks as any)[task] ?? (reg.tasks as any).chat;
  const chain: string[] = site?.chains?.[task] ?? t.chain;
  const freeOnly = site?.freeOnly ?? reg.free_only_default;
  return chain.filter((id) => {
    const p = (reg.providers as any)[id];
    if (!p || site?.disabled?.includes(id)) return false;
    if (freeOnly && !p.free) return false;
    return p.local || !p.env || !!env[p.env];
  });
}

