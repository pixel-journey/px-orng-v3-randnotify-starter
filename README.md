# A job table that resolves once

> **Trust:** private educational lab (Tier B)  
> **Quest:** 001 — minimal requestrand + randnotify hygiene  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a pending job and the callback gates around it: `dapp` must equal `self`, the caller must be the configured oracle, and a job resolves **once**.

**Real code:** `npm test`. **Does not** call `orng.wax`, spend RNG credits, or produce wasm. `requestrandBody` builds an object. It does not broadcast.

## What you can learn

- Why a notify that is not addressed to this contract must be ignored.
- Why a random account must not be able to mark a job resolved.
- Why a second callback on the same id is a double-pay if you do not keep a resolved flag.
- Why an unsigned action body is a teaching shape, not a proof the oracle was asked.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/orng.ts` | `openJob`, `canHandleNotify`, `resolveJob`, `requestrandBody` |
| `invariants/orng.test.ts` | Executed claims |
| `EDUCATION.md` | Why the four checks exist |
| `SECURITY.md` | What a real notify path still needs |

## What is true (executed)

| Rule | Result |
| --- | --- |
| `openJob([], 1n, "alice", "wager-1")` | one job, `resolved` false |
| Same id opened again | `job id already open` |
| Notify with `self` and `dapp` both `dappcontract`, caller `orng.wax` | job owner `alice` |
| `dapp` is `otherdapp` | `dapp must equal self` |
| Caller is `evil` | `caller must be orng` |
| Notify against an empty table | `unknown job` |
| `resolveJob` once | `resolved` true |
| Second `resolveJob` on that job | `job already resolved` |
| `requestrandBody("dappcontract", 42n, 64 hex chars)` | account `orng.wax`, name `requestrand`, `assoc_id` `"42"` |
| Signing value `"zz"` | refused |

## The rule, in order

```text
openJob:     new id, owner, assoc; resolved starts false
canHandle:   dapp === self
             caller === configured orng
             job id exists and is not resolved
resolveJob:  same gates, then resolved = true
requestrand: unsigned { account: orng.wax, name: requestrand }
```

Job ids must be a positive `bigint`. Account names are a format check. `assoc` in the source must be 1–64 characters. The table refuses a 33rd open job. Those two caps are in `openJob`; the tests do not hit them.

`signingValue` must be 64 hex characters. The body lowercases it. Nothing stores that value on the job, and nothing checks `assoc` during notify.

```ts
import { openJob, resolveJob, requestrandBody } from "./invariants/orng.ts";

const ctx = {
  self: "dappcontract",
  dapp: "dappcontract",
  caller: "orng.wax",
  orng: "orng.wax",
  jobId: 1n,
};

let jobs = openJob([], 1n, "alice", "wager-1");
jobs = resolveJob(jobs, ctx);
// jobs[0].resolved === true
// resolveJob(jobs, ctx) throws "job already resolved"

requestrandBody("dappcontract", 42n, "a".repeat(64));
// { account: "orng.wax", name: "requestrand", data.assoc_id: "42" }
```

## Edge cases

- `orng` is a field on the context, not a network lookup. The tests set it to `orng.wax`. A different string would be the trusted caller for that call.
- Resolving does not pay anyone. There is no wager amount and no payout.
- The job's `assoc` string is not the `assoc_id` on the unsigned body. The tests never link them.
- A missing job and an already-resolved job are different errors.

## Best practice and the opposite

**Do** require the notify to name this contract, require the oracle account, and refuse a second resolve.  
**Do** keep the request body unsigned until a real signer exists.

**Do not** treat a passing `resolveJob` as `require_auth(orng.wax)`. This file compares strings.  
**Do not** treat `requestrandBody` as a sent transaction.

## Live path, not shipped

```
openJob → canHandleNotify → resolveJob   [tested]
requestrandBody (object only)           [tested]
    → broadcast requestrand                [not in this repo]
    → on_notify from orng.wax               [not in this repo]
    → payout                                [not in this repo]
```

See [EDUCATION.md](EDUCATION.md) and [SECURITY.md](SECURITY.md).

## Related

- `px-orng-dual-callback-idempotent` — two callback paths, one resolver
- `px-orng-coinflip-escrow` — payout math, a different repo
- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
