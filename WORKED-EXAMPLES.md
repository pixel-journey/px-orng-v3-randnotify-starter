# Worked examples — ORNG v3 job table

Companion to [EDUCATION.md](EDUCATION.md).

## Example 1 — open and resolve once

```text
jobs = openJob([], 1n, "alice", "wager-1")
// one job, resolved false

jobs = resolveJob(jobs, {
  self: "dappcontract",
  dapp: "dappcontract",
  caller: "orng.wax",
  orng: "orng.wax",
  jobId: 1n,
})
// resolved true

resolveJob again → "job already resolved"
```

## Example 2 — wrong caller / wrong dapp

| Context change | Error |
| --- | --- |
| `caller: "evil"` | `caller must be orng` |
| `dapp: "otherdapp"` | `dapp must equal self` |
| `jobId: 99n` on empty table | `unknown job` |

Failed gates **must not** mark the job resolved (composition locks this).

## Example 3 — two concurrent jobs

Open id `1` for alice and id `2` for bob. Resolve `1` only → bob’s job still pending. Resolve `2` → both resolved. No shared payout flag across ids.

## Example 4 — unsigned requestrand shape

```text
requestrandBody("dappcontract", 42n, <64 hex chars>)
→ { account: "orng.wax", name: "requestrand",
    data: { caller, assoc_id: "42", signing_value } }
```

Teaching shape only — not broadcast. Signing value `"zz"` is refused.

## Example 5 — production sequence (not in this repo)

```text
1. openJob in dapp table (RAM)
2. send requestrand to orng.wax with matching assoc_id
3. on_notify / randnotify from orng.wax
4. canHandleNotify gates
5. resolve once + pay wager
```

Credits, stake, and payout math are separate labs (see `px-contract-examples-vault` (private index; not this public course)).
