import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  openJob,
  canHandleNotify,
  resolveJob,
  requestrandBody,
} from "./orng.ts";

const baseCtx = {
  self: "dappcontract",
  dapp: "dappcontract",
  caller: "orng.wax",
  orng: "orng.wax",
  jobId: 1n,
};

describe("openJob", () => {
  it("opens a pending job", () => {
    const jobs = openJob([], 1n, "alice", "wager-1");
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0].resolved, false);
  });

  it("refuses duplicate id", () => {
    const jobs = openJob([], 1n, "alice", "wager-1");
    assert.throws(() => openJob(jobs, 1n, "bob", "wager-2"), /already open/);
  });

  it("refuses empty or overlong assoc", () => {
    assert.throws(() => openJob([], 1n, "alice", ""), /assoc length/);
    assert.throws(() => openJob([], 1n, "alice", "x".repeat(65)), /assoc length/);
  });

  it("refuses non-positive job id", () => {
    assert.throws(() => openJob([], 0n, "alice", "wager-1"), /positive/);
  });

  it("refuses a 33rd open job", () => {
    let jobs = [];
    for (let i = 1; i <= 32; i++) {
      jobs = openJob(jobs, BigInt(i), "alice", `w-${i}`);
    }
    assert.equal(jobs.length, 32);
    assert.throws(() => openJob(jobs, 33n, "alice", "w-33"), /too many open jobs/);
  });
});

describe("canHandleNotify", () => {
  it("accepts matching dapp/self and orng caller", () => {
    const jobs = openJob([], 1n, "alice", "wager-1");
    const job = canHandleNotify(jobs, baseCtx);
    assert.equal(job.owner, "alice");
  });

  it("refuses dapp !== self", () => {
    const jobs = openJob([], 1n, "alice", "wager-1");
    assert.throws(
      () => canHandleNotify(jobs, { ...baseCtx, dapp: "otherdapp" }),
      /dapp must equal self/,
    );
  });

  it("refuses non-orng caller", () => {
    const jobs = openJob([], 1n, "alice", "wager-1");
    assert.throws(
      () => canHandleNotify(jobs, { ...baseCtx, caller: "evil" }),
      /caller must be orng/,
    );
  });

  it("refuses unknown job", () => {
    assert.throws(() => canHandleNotify([], baseCtx), /unknown job/);
  });
});

describe("resolveJob", () => {
  it("resolves once", () => {
    let jobs = openJob([], 1n, "alice", "wager-1");
    jobs = resolveJob(jobs, baseCtx);
    assert.equal(jobs[0].resolved, true);
  });

  it("refuses second resolve", () => {
    let jobs = openJob([], 1n, "alice", "wager-1");
    jobs = resolveJob(jobs, baseCtx);
    assert.throws(() => resolveJob(jobs, baseCtx), /already resolved/);
  });
});

describe("requestrandBody", () => {
  it("builds unsigned body and lowercases signing value", () => {
    const hex = "A".repeat(64);
    const body = requestrandBody("dappcontract", 42n, hex);
    assert.equal(body.account, "orng.wax");
    assert.equal(body.name, "requestrand");
    assert.equal(body.data.assoc_id, "42");
    assert.equal(body.data.signing_value, "a".repeat(64));
  });

  it("refuses bad signing value", () => {
    assert.throws(() => requestrandBody("dappcontract", 1n, "zz"), /hex/);
  });
});
