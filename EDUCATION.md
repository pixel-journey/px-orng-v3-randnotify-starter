# Education — ORNG notify hygiene

> **Rung:** `npm test` passes. There is no wasm, no broadcast, and no call to `orng.wax`.  
> **The test is the rule.** Masterclass sections below say what a contract must still add. They are not claims that this repo does those things.

Read [README.md](README.md) for the executed table. Read [SECURITY.md](SECURITY.md) for the attack list. Then use this file as the course.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Say why a randomness callback needs a job row, and name the three gates |
| Intermediate | Walk `openJob`, `canHandleNotify`, `resolveJob`, and `requestrandBody` against the tests |
| Masterclass | Specify the Antelope checks this string-compare lab does not perform, without weakening the once-only rule |

---

## Beginner — one scene

Alice records a wager under job id `1` with a note `wager-1`. Later a message arrives: "randomness for job 1 is ready." Before any payout, three questions:

1. Is the message addressed to **this** contract? (`dapp` equals `self`)
2. Did the **oracle account** send it? (`caller` equals the configured `orng`)
3. Is this job still **unpaid**? (`resolved` is false)

If any answer is no, you do not pay. This lab stops at "mark resolved." It never pays.

### Words

| Word | In this lab |
| --- | --- |
| Job | A row: id, owner, resolved flag, assoc string |
| `self` | The contract you are pretending to be (`dappcontract` in the tests) |
| `dapp` | Who the callback says it is for |
| `caller` | Who is asking you to resolve |
| `orng` | The account you trust as the oracle. The tests use `orng.wax` |
| `assoc` | A note stored on the job. Notify does **not** read it |
| `signingValue` | 64 hex characters on an **unsigned** request body. Not stored on the job |
| `requestrand` | The action name on the body. Nothing is sent |

### The picture the tests actually run

```text
openJob(id=1, owner=alice, assoc=wager-1)  → pending
canHandleNotify(dapp=self, caller=orng.wax) → ok
resolveJob                                      → resolved true
resolveJob again                                → throw "job already resolved"
```

A second `openJob` with id `1` throws `job id already open`. A notify whose `dapp` is `otherdapp` throws `dapp must equal self`. A caller named `evil` throws `caller must be orng`. An empty table throws `unknown job`.

### Predict, then run

```bash
npm test
```

1. What is `resolved` immediately after `openJob`? (`false`)
2. Does `requestrandBody` contact the network? (No. It returns `{ account: "orng.wax", name: "requestrand" }`.)
3. What happens to `assoc_id` when you pass `42n` and 64 `a` characters? (The string `"42"`. The hex is not checked against the job.)

---

## Intermediate — walk the file

Source: `invariants/orng.ts`. Tests: `invariants/orng.test.ts`.

### `openJob`

Refuses a job id that is not a positive `bigint`, a bad account name, an `assoc` shorter than 1 or longer than 64, a duplicate id, and a 33rd open job. The tests cover the happy open and the duplicate id. They do **not** cover the length cap or the 32-job cap. Those refusals are still in the source.

The new row always starts `resolved: false`. Opening does not look at `orng`.

### `canHandleNotify`

Order of checks:

1. Names and job id are well-formed.
2. `dapp !== self` → `dapp must equal self`.
3. `caller !== orng` → `caller must be orng`.
4. No row with that id → `unknown job`.
5. Row already resolved → `job already resolved`.

It returns the job. It does not mutate the table.

### `resolveJob`

Calls `canHandleNotify`, then maps that one id to `resolved: true`. The second call fails inside the gate. There is no payout field to double-pay, which is why this lab can teach the flag without teaching escrow.

### `requestrandBody`

Checks the contract name, a positive `assocId`, and `/^[0-9a-f]{64}$/i`. It lowercases the hex. The returned object is the teaching shape of an action. `"zz"` fails the hex test. Building the object does not prove credits, a signature, or that `assocId` matches an open job.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Open the same id twice | Two wagers, one callback | `job id already open` | `refuses duplicate id` |
| Notify aimed at another contract | You still pay | `dapp must equal self` | `refuses dapp !== self` |
| User calls resolve | User pays themselves | `caller must be orng` | `refuses non-orng caller` |
| Resolve a ghost id | You invent a payout | `unknown job` | `refuses unknown job` |
| Callback replay | Second payout | `job already resolved` | `refuses second resolve` |
| Short "random" hex | You accept garbage as a request | hex error | `refuses bad signing value` |

---

## Masterclass — what you still have to write

Copying this file into a contract would be wrong even though every test passes. The lab compares strings a caller supplies. A contract must not.

### Callback is not a function call from nowhere

On Antelope, `orng.wax` executes `randnotify` (and older flows use `receiverand`). Your contract sees a **notification**. The first receiver is the oracle, not you. The checks that match this lab:

- The notified `dapp` (or equivalent field) equals `get_self()`.
- `require_auth(orng.wax)` on that path, or the notification can only be sent by that account's action. A parameter named `caller` that the user sets is not `require_auth`.
- Your `receiverand` handler, if you still ship one, also `require_auth`s the oracle. See the vault standard.

`px-orng-dual-callback-idempotent` is the neighbor that forces both callback names through **one** resolver. This starter only has `resolveJob`.

### Bind the request to the job

This lab stores `assoc` and also builds a `signing_value`, and never checks that they belong together. A production job row needs the `assoc_id` you will receive and the signing value you committed **before** the oracle answers. Otherwise a callback for job 2 can be applied to job 1 because both were merely "open."

The signing value is a commitment. It is not the random result. Do not use tapos, a block hash, or a user-supplied "random" string as the outcome.

### Once-only is a state change under the same checks

A boolean flag works if every path that pays sets it in the same transaction as the pay, and every path reads it first. Two actions (`randnotify` and `receiverand`) that each set their own flag will pay twice. One function, one row.

Erasing the row also makes a second call fail, but then you cannot explain a late duplicate. A flag (this lab) or a consumed receipt both work if there is only one writer.

### RAM, credits, payout

Not in this repo:

- Who pays the job row. An open faucet of `openJob` paid by the contract is a RAM attack. The lab's 32-job cap is a teaching bound, not a RAM policy.
- Oracle credits / stake. Requesting randomness has a cost. The unsigned body does not pay it.
- The outcome bytes and the payout. That is `px-orng-coinflip-escrow`, which is a different tested rule (10000 in → 19600 out, once).

### Exercise — do not skip the label

Write, on paper, the five checks a `randnotify` handler must pass **before** it transfers a token. Mark each line `in this repo` or `not in this repo`.

Answer shape:

| Check | Here? |
| --- | --- |
| Job id exists | Yes |
| Not yet resolved | Yes |
| `dapp == get_self()` | Only as a string compare named `dapp` / `self` |
| `require_auth(orng.wax)` | No |
| `assoc_id` and signing value match the stored commitment | No |
| Transfer the payout | No |

If you mark the last three as done, you have left the truth ladder.

---

## What this course will not teach

- A live `requestrand` transaction
- Rejection sampling or modulo bias (the coinflip repo)
- That the tests hit the 64-character `assoc` limit or the 32-job limit (they do not)
