# px-orng-v3-randnotify-starter

> **Trust:** private educational lab (Tier B)  
> **Quest:** 001 — minimal requestrand + randnotify hygiene  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach a minimal job table and **randnotify hygiene**: `dapp == self`, caller must be `orng.wax`, resolve **once**, and build an **unsigned** `requestrand` body.

**Real code:** `npm test` runs TypeScript invariants. **Does not** call `orng.wax`, pull RNG credits, or produce wasm.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| `openJob` | pending job; duplicate id refused |
| Notify | requires `dapp === self` and `caller === orng` |
| `resolveJob` | once-only; second resolve refused |
| `requestrandBody` | unsigned shape; 64-hex signing value required |

```bash
npm test
```

---

## Layout

| Path | Role |
|------|------|
| `invariants/orng.ts` | Job table + notify gates + unsigned body |
| `invariants/orng.test.ts` | Executed claims |
| `EDUCATION.md` | Why these checks exist |
| `SECURITY.md` | Callback attack surface |

Neighbor with payout math: `px-orng-coinflip-escrow`.

## License

MIT — Pixel Journey
