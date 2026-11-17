# Tips — orng.wax job table

## Job table

- Cap open jobs (this lab: 32) so a grief loop cannot unbounded-RAM you.
- Refuse duplicate job ids **before** calling `requestrand`.
- Store `assoc_id` and the signing value you committed, and check both on delivery.
- Pay **exactly once** when entropy arrives.

## Callback gates (order)

1. Notification is for **this** contract (`dapp == get_self()`).
2. Caller is **orng.wax** via `require_auth`, not a user-set string.
3. Job exists and is **not** already resolved.
4. Then apply entropy → payout → mark resolved in the **same** action when you can.

If you mark resolved before payout and the payout fails, you strand the wager. If you pay before the flag and the action reverts, you are safe only because the whole transaction reverts. Do not split pay and flag across two transactions without a receipt.

## Common mistakes

1. Two handlers (`randnotify` and `receiverand`) each with their own flag — double pay. Use [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent).
2. Treating the signing value as the random result.
3. Opening a job you cannot fund — gate credits first ([credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor)).
4. Applying job 2's callback to job 1 because both were merely "open."
5. Copying this lab's string compare into a contract and calling it `require_auth`.

## Nice-to-have extensions (other repos, not this file)

| Need | Lab |
| --- | --- |
| Both callback names | [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) |
| Legacy path only | [receiverand adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) |
| Free then paid credits | [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) |
| 0.01 WAX top-up | [pay-per-use](https://github.com/pixel-journey/px-orng-pay-per-use-topup-vault) |
| Stake for free credits | [auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager) |
| House-edge payout | [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) / [dice](https://github.com/pixel-journey/px-orng-dice-multi-tier-payout) |
| No orng on the chain | [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier), [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) |

## Prefer the production oracle

Fallbacks are educational. On WAX mainnet prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng).

Path: [ORNG-LEARNING-PATH](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md).
