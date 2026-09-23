# rock-paper-scissors

## Public Methods

### `initialize`
One-time setup: the wager token and the protocol fee in basis points (max [`MAX_FEE_BPS`]).

```rust
pub fn initialize(env: Env, token: Address, fee_bps: u32) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `token` | `Address` |
| `fee_bps` | `u32` |

#### Return Type

`Result<(), Error>`

### `create_match`
Open a match: player1 escrows `wager_amount` and commits their move hash. Returns the new match id.

```rust
pub fn create_match(env: Env, player: Address, wager_amount: i128, commitment: BytesN<32>) -> Result<u64, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `player` | `Address` |
| `wager_amount` | `i128` |
| `commitment` | `BytesN<32>` |

#### Return Type

`Result<u64, Error>`

### `join_match`
Join an open match: player2 escrows a matched wager and commits their move hash, opening the reveal window for both players.

```rust
pub fn join_match(env: Env, match_id: u64, player: Address, commitment: BytesN<32>) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |
| `player` | `Address` |
| `commitment` | `BytesN<32>` |

#### Return Type

`Result<(), Error>`

### `reveal_move`
Reveal a committed move by supplying the plaintext choice and salt.  Only valid once the match is `Committed` (both players have joined and committed) or already `Revealed` (the first reveal has happened and this is the second).

```rust
pub fn reveal_move(env: Env, match_id: u64, player: Address, move_choice: Move, salt: BytesN<32>) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |
| `player` | `Address` |
| `move_choice` | `Move` |
| `salt` | `BytesN<32>` |

#### Return Type

`Result<(), Error>`

### `settle_match`
Resolve a match once both players have revealed. Evaluates the winner and disburses the escrowed pot.

```rust
pub fn settle_match(env: Env, match_id: u64) -> Result<MatchResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |

#### Return Type

`Result<MatchResult, Error>`

### `claim_timeout`
Claim a forfeit (or trigger a mutual refund) once the reveal window has closed.  - If exactly one player revealed, that player wins the pot by forfeit — callable by anyone once the deadline passes. - If both players revealed, behaves like [`RockPaperScissors::settle_match`] (kept idempotent-friendly: a late `claim_timeout` after both reveals still resolves correctly instead of erroring). - If neither player revealed, both wagers are refunded with no winner and no fee — no one proved their commitment, so there is no fair way to declare a winner.

```rust
pub fn claim_timeout(env: Env, match_id: u64, caller: Address) -> Result<MatchResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |
| `caller` | `Address` |

#### Return Type

`Result<MatchResult, Error>`

### `get_match_summary`
Full match state, including commit presence/reveal status for both players.

```rust
pub fn get_match_summary(env: Env, match_id: u64) -> Result<MatchSummary, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |

#### Return Type

`Result<MatchSummary, Error>`

### `get_result`
Settlement record for a settled match.

```rust
pub fn get_result(env: Env, match_id: u64) -> Result<MatchResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `match_id` | `u64` |

#### Return Type

`Result<MatchResult, Error>`

