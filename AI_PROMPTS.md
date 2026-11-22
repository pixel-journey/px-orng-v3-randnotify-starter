# AI handoff — ORNG v3 randnotify starter

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | requestrand, callbacks |
| [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | Sample path |
| [ORNG-LEARNING-PATH](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Curriculum order |
| [dual-callback](https://github.com/pixel-journey/px-orng-dual-callback-idempotent) | One resolve flag |
| [ANTELOPE-PORTABILITY](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | `orng.wax` is WAX-only |

## Non-negotiables

1. Live account is **`orng.wax`**. This lab compares **strings** for caller/`dapp` and never broadcasts.
2. Job + once is step 1; dual-callback is the one-writer rule.
3. Prefer **orng.wax** on WAX over TAPOS / commit-reveal / drand fallbacks unless orng is unavailable and documented.
4. `orng.wax` does **not** exist on EOS/Telos/XPR. The job-table pattern can be reimplemented; the account name cannot be copied.
5. Unsigned `requestrand` shape only — no live oracle call.
6. Prefer WharfKit SessionKit for any later host.

## Prompt seeds

- "Open a job, then show a second open with the same id is refused."
- "List wax-orng callback names and map them to pure handlers."
- "Port the job table to another chain without inventing orng.wax."
- "Point at dual-callback before building a payout book."

## Do not

- Call orng.wax from this pure lab.
- Claim orng exists on every Antelope chain.
- Ship fallback RNG on WAX without documenting why orng is skipped.
