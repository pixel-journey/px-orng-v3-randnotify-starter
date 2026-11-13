# A job table that resolves once

> **Domain:** WAX ORNG (`orng.wax`) starter  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach a pending job and the callback gates around it: `dapp` must equal `self`, the caller must be the configured oracle, and a job resolves **once**.

**Code under test:** `npm test`. Does not call `orng.wax`, spend RNG credits, or produce wasm. `requestrandBody` builds an unsigned action shape — it does not broadcast.

**Official service:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). **Sample:** [RNG smart contract tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## Learning outcomes

- Why a notify that is not addressed to this contract must be ignored.
- Why a random account must not be able to mark a job resolved.
- Why a second callback on the same id is a double-pay if you omit a resolved flag.
- Why an unsigned action body is a teaching shape, not proof the oracle was asked.

## What is in the repo

| Piece | Role |
| --- | --- |
| `invariants/orng.ts` | `openJob`, `canHandleNotify`, `resolveJob`, `requestrandBody` |
| `invariants/orng.test.ts` | Executed claims |
| `EDUCATION.md` / `SECURITY.md` / `SOURCES.md` | Pedagogy, threat model, official links |

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

## Live path, not shipped

```
openJob → canHandleNotify → resolveJob   [tested]
requestrandBody (object only)           [tested]
    → broadcast requestrand                [not in this repo]
    → on_notify from orng.wax               [not in this repo]
    → payout                                [not in this repo]
```

## Related

- [px-orng-dual-callback-idempotent](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) — two callback paths, one resolver
- [px-orng-coinflip-escrow](https://github.com/pixel-journey/px-orng-coinflip-escrow) — payout math
- [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) — shared once / seen / hex helpers

```bash
npm test
```

MIT — Pixel Journey
