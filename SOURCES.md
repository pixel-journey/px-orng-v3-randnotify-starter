# Sources

## Official ORNG / WAX

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | `requestrand`, callbacks, RSA threshold design |
| [wax-rng-oracle](https://github.com/worldwide-asset-exchange/wax-rng-oracle) | Oracle member process |
| [RNG sample tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | docs.wax.io request + table hygiene |
| [docs.wax.io](https://docs.wax.io/) | WAX development |

Live account: `orng.wax`. This lab compares **strings** for caller/`dapp` and never broadcasts.

## WharfKit (host / agent)

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | Prefer SessionKit over eosjs |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Agent skill: Session, Contract, patterns |
| [@wharfkit/session](https://www.npmjs.com/package/@wharfkit/session) | Login / transact |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX defaults |
| [@wharfkit/cli](https://www.npmjs.com/package/@wharfkit/cli) | Typed codegen for contracts |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Curriculum (read in this order)

| Step | Repo |
| --- | --- |
| 1 Job + once | **this repo** |
| 2 Legacy name | [receiverand adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) |
| 3 Both names, one writer | [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) |
| 4 Credits before open | [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) |
| 5 Pay-per-call / stake | [topup](https://github.com/pixel-journey/px-orng-pay-per-use-topup-vault) · [auto-stake](https://github.com/pixel-journey/px-orng-auto-wax-stake-manager) |
| 6 Game books | [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) · [dice](https://github.com/pixel-journey/px-orng-dice-multi-tier-payout) · [roulette](https://github.com/pixel-journey/px-orng-roulette-wheel-escrow) |
| 7 Sampling helpers | [loot CDF](https://github.com/pixel-journey/px-orng-weighted-loot-table-cdf) · [byte-slicer](https://github.com/pixel-journey/px-orng-byte-slicer-multi-roll) |
| 8 If orng is down | [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier) · [TAPOS](https://github.com/pixel-journey/px-rng-fallback-future-block-tapos) · [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal) |

Index: [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md). Shared once-flag: [invariant-kit](https://github.com/pixel-journey/px-invariant-kit).
