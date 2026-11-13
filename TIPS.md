# Tips — integrating orng.wax

## Job table

- Cap open jobs (this lab: 32) so a grief loop cannot unbounded-RAM you.
- Refuse duplicate `assoc_id` / job id before calling `requestrand`.
- Store enough state to pay **exactly once** when entropy arrives.

## Callback gates (order matters)

1. Notification is for **this** contract (`dapp == self`).
2. Caller is **orng.wax** (or your configured oracle account).
3. Job exists and is **not** already resolved.
4. Then apply entropy → payout → mark resolved.

If you mark resolved before payout and the payout fails, you have stranded funds. Prefer: compute payout → pay → mark resolved in one action, or use a carefully designed two-phase with refund.

## Dual delivery paths

Legacy `receiverand` and v3 `randnotify` must share **one** resolver. See [px-orng-dual-callback-idempotent](https://github.com/pixel-journey/px-orng-dual-callback-idempotent).

## Economics

Free credits, paid credits, auto-stake, and pay-per-call top-up are separate labs. Gate the **wager accept** path on credits before you open a job you cannot afford to resolve.

## Prefer production oracle

Fallbacks (commit-reveal, future-block TAPOS, multi-oracle) are educational. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) on WAX mainnet/testnet.
