# Security notes — ORNG job / notify path

## Mitigated in the lab (tested)

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

## Production still needs

| Concern | Guidance |
| --- | --- |
| Auth | Real `require_auth(orng.wax)` on the notify path |
| Routing | Correct Antelope `on_notify` / first-receiver checks |
| RAM | Explicit payer policy for job rows |
| Binding | `assoc_id` / signing value bound to the pending wager exactly once |
| Credits | Do not open jobs you cannot fund (see credit / stake labs) |
| Payout atomicity | Resolve flag vs token transfer ordering |
| Entropy use | Rejection sampling for modular rolls (dice / multi-roll labs) |

This repository does **not** call `orng.wax` and does not move tokens.

## Related security docs

- Dual-callback idempotency: [px-orng-dual-callback-idempotent](https://github.com/pixel-journey/px-orng-dual-callback-idempotent)
- Pause / msig recovery patterns: [px-token-pausable-emergency-guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard)
