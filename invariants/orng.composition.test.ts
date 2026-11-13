/**
 * Composition: multi-job open → wrong gates → resolve once → independent jobs.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  openJob,
  resolveJob,
  requestrandBody,
  type Job,
  type NotifyContext,
} from "./orng.ts";

const base = (jobId: bigint): NotifyContext => ({
  self: "dappcontract",
  dapp: "dappcontract",
  caller: "orng.wax",
  orng: "orng.wax",
  jobId,
});

describe("composition: ORNG job lifecycle", () => {
  it("two jobs resolve independently without cross-bleed", () => {
    let jobs: Job[] = [];
    jobs = openJob(jobs, 1n, "alice", "wager-1");
    jobs = openJob(jobs, 2n, "bob", "wager-2");
    jobs = resolveJob(jobs, base(1n));
    assert.equal(jobs.find((j) => j.id === 1n)?.resolved, true);
    assert.equal(jobs.find((j) => j.id === 2n)?.resolved, false);
    jobs = resolveJob(jobs, base(2n));
    assert.equal(jobs.find((j) => j.id === 2n)?.resolved, true);
  });

  it("failed gates leave jobs unresolved for a correct retry", () => {
    let jobs: Job[] = openJob([], 7n, "alice", "seed");
    assert.throws(
      () => resolveJob(jobs, { ...base(7n), caller: "evil" }),
      /caller must be orng/,
    );
    assert.throws(
      () => resolveJob(jobs, { ...base(7n), dapp: "otherdapp" }),
      /dapp must equal self/,
    );
    assert.equal(jobs[0]?.resolved, false);
    jobs = resolveJob(jobs, base(7n));
    assert.equal(jobs[0]?.resolved, true);
    assert.throws(() => resolveJob(jobs, base(7n)), /job already resolved/);
  });

  it("requestrand body then open then resolve once", () => {
    const body = requestrandBody(
      "dappcontract",
      42n,
      "a".repeat(64),
    );
    assert.equal(body.account, "orng.wax");
    assert.equal(body.data.assoc_id, "42");
    let jobs: Job[] = openJob([], 42n, "alice", "wager-42");
    jobs = resolveJob(jobs, base(42n));
    assert.equal(jobs[0]?.resolved, true);
  });
});
