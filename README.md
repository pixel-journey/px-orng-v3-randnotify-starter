# A job table that resolves once

> **Domain:** WAX ORNG (`orng.wax`) starter  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Teach a pending job and the callback gates around it: `dapp` must equal `self`, the caller must be the configured oracle, and a job resolves **once**.

**Code under test:** `npm test` (unit + multi-job composition). Does not call `orng.wax`, spend RNG credits, or produce wasm. `requestrandBody` builds an unsigned action shape — it does not broadcast.

**Official service:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). **Sample:** [RNG smart contract tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Concrete sequences |
| [TIPS.md](TIPS.md) | Integration checklist |
| [SECURITY.md](SECURITY.md) | Callback threat model |
| [SOURCES.md](SOURCES.md) | Official + related labs |

## Learning outcomes

- Why a notify that is not addressed to this contract must be ignored.
- Why a random account must not mark a job resolved.
- Why a second callback on the same id is a double-pay without a resolved flag.
- Why an unsigned action body is a teaching shape, not proof the oracle was asked.

## What is true (executed)

| Rule | Result |
| --- | --- |
| `openJob([], 1n, "alice", "wager-1")` | one job, `resolved` false |
| Same id opened again | `job id already open` |
| Notify with matching self/dapp/orng | resolves owner `alice` |
| Wrong dapp / wrong caller | refused; job stays unresolved |
| Second resolve | `job already resolved` |
| Two concurrent jobs | resolve independently |
| `requestrandBody` with 64 hex | unsigned `orng.wax::requestrand` shape |

## Live path, not shipped

```
openJob → canHandleNotify → resolveJob   [tested]
requestrandBody (object only)           [tested]
    → broadcast requestrand                [not in this repo]
    → on_notify from orng.wax               [not in this repo]
    → payout                                [not in this repo]
```

## Related

- [px-orng-dual-callback-idempotent](https://github.com/pixel-journey/px-orng-dual-callback-idempotent)
- [px-orng-legacy-receiverand-adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter)
- [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit)

```bash
npm test
```

MIT — Pixel Journey
