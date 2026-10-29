# Education

## The pattern

ORNG-style flows typically:

1. Record a **job** (wager, reveal slot, craft lock) under an id / assoc
2. Request randomness (`requestrand`)
3. Handle a **callback** (`randnotify` / legacy `receiverand`) that may arrive once — or be replayed by mistake

This lab teaches the **callback gate** without network calls.

## Checks that matter

| Check | Why |
|-------|-----|
| `dapp === self` | Notification is addressed to this contract |
| `caller === orng` | Only the oracle account may resolve |
| Job exists | No resolve of ghost ids |
| Not already resolved | Idempotent safety / no double pay |

## Unsigned requestrand body

`requestrandBody` shows the teaching shape of an action. Building the object is **not** a broadcast and **not** a proof that credits exist.

## Next quests

- Dual callback paths: `px-orng-dual-callback-idempotent`
- Full escrow payouts: `px-orng-coinflip-escrow`
