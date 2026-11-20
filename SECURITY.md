# Security — ORNG job / notify path

## Closed in tests

| Attack | Lab mitigation |
| --- | --- |
| Foreign contract triggers “notify” | `dapp` must equal `self` |
| Random account calls resolve | `caller` must equal configured `orng` |
| Double callback pays twice | `resolved` flag; second resolve throws |
| Resolve missing job | `unknown job` refused |
| Duplicate job id | `job id already open` |
| Unbounded table | max 32 open jobs |
| Bad signing value shape | 64 hex chars required for `requestrandBody` |

Composition: failed gates leave the job unresolved; two jobs do not share resolve state.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Auth | Real `require_auth(orng.wax)` on the notify path |
| Routing | Correct Antelope `on_notify` / first-receiver checks |
| RAM | Explicit payer policy for job rows |
| Binding | `assoc_id` / signing value bound to the pending wager exactly once |
| Credits | Do not open jobs you cannot fund ([bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) · [topup](https://github.com/pixel-journey/px-orng-pay-per-use-topup-vault)) |
| Payout atomicity | Resolve flag vs token transfer ordering |
| Dual callback | Shared writer — [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) |
| Entropy use | Rejection sampling for modular rolls (dice / multi-roll labs) |

## Attack angles

1. A user-set `caller` field instead of `require_auth(orng.wax)`.  
2. Separate flags for `randnotify` and `receiverand` (double pay).  
3. Opening a job without checking credits first.  
4. Applying a callback for job 2 to job 1 because both were merely "open."  
5. Treating `requestrandBody` as a broadcast.

## Honesty limits

This repository does **not** call `orng.wax` and does not move tokens. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). Related: [legacy adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) · [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) · `px-contract-examples-vault` (private index; not this public course).
