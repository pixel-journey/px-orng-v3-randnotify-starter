/**
 * Minimal ORNG v3-style job table and randnotify hygiene (educational).
 * Does not call orng.wax. Does not broadcast.
 */

export type Job = {
  id: bigint;
  owner: string;
  resolved: boolean;
  /** Opaque seed placeholder — not chain entropy. */
  assoc: string;
};

export type NotifyContext = {
  /** Simulated get_self() */
  self: string;
  /** Simulated notification intended dapp / first-party check */
  dapp: string;
  /** Simulated require_auth source for the notify path */
  caller: string;
  /** Account trusted as orng.wax in this lab */
  orng: string;
  jobId: bigint;
};

const NAME = /^[a-z1-5.]{1,12}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function assertJobId(id: bigint): bigint {
  if (typeof id !== "bigint" || id < 1n) throw new Error("job id must be a positive bigint");
  return id;
}

/** Open a pending job. Refuses duplicate ids. */
export function openJob(
  jobs: readonly Job[],
  id: bigint,
  owner: string,
  assoc: string
): Job[] {
  assertJobId(id);
  assertName(owner);
  if (assoc.length < 1 || assoc.length > 64) throw new Error("assoc length 1..64");
  if (jobs.some((j) => j.id === id)) throw new Error("job id already open");
  if (jobs.length >= 32) throw new Error("too many open jobs");
  return [...jobs, { id, owner, resolved: false, assoc }];
}

/**
 * Can this notify be handled?
 * - dapp must equal self (notification is for this contract)
 * - caller must be orng
 * - job must exist and not already be resolved
 */
export function canHandleNotify(jobs: readonly Job[], ctx: NotifyContext): Job {
  assertName(ctx.self);
  assertName(ctx.dapp);
  assertName(ctx.caller);
  assertName(ctx.orng);
  assertJobId(ctx.jobId);
  if (ctx.dapp !== ctx.self) throw new Error("dapp must equal self");
  if (ctx.caller !== ctx.orng) throw new Error("caller must be orng");
  const job = jobs.find((j) => j.id === ctx.jobId);
  if (!job) throw new Error("unknown job");
  if (job.resolved) throw new Error("job already resolved");
  return job;
}

/** Resolve once: mark job resolved. Second resolve refused via canHandleNotify. */
export function resolveJob(jobs: readonly Job[], ctx: NotifyContext): Job[] {
  canHandleNotify(jobs, ctx);
  return jobs.map((j) => (j.id === ctx.jobId ? { ...j, resolved: true } : j));
}

/**
 * Unsigned requestrand-shaped body for teaching — not sent.
 */
export function requestrandBody(
  self: string,
  assocId: bigint,
  signingValue: string
): { account: string; name: string; data: Record<string, string> } {
  assertName(self);
  assertJobId(assocId);
  if (!/^[0-9a-f]{64}$/i.test(signingValue)) {
    throw new Error("signingValue must be 64 hex chars");
  }
  return {
    account: "orng.wax",
    name: "requestrand",
    data: {
      caller: self,
      assoc_id: assocId.toString(),
      signing_value: signingValue.toLowerCase(),
    },
  };
}
