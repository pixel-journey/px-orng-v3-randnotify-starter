# Security notes

## Callback surface

| Attack | Lab mitigation |
|--------|----------------|
| Foreign contract triggers “notify” | `dapp` must equal `self` |
| Random account calls resolve | `caller` must equal configured `orng` |
| Double callback pays twice | `resolved` flag; second resolve throws |
| Resolve missing job | unknown job refused |

## Production still needs

- Real `require_auth(orng.wax)` on the notify path
- Correct Antelope notification routing (`on_notify` / first receiver as applicable)
- Job RAM payer policy
- Linking `assoc_id` / signing value to the pending wager exactly once
- RNG credit / stake economics (separate quests)

This repository does **not** call `orng.wax`.
