# minesweeper-escrow

## Public Methods

### `initialize`
One-time setup: admin and the wager token.

```rust
pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `admin` | `Address` |
| `token` | `Address` |

#### Return Type

`Result<(), Error>`

### `start_game`
Start a new game: escrow `wager_amount` from `player`, and fix the mine layout by committing `board_hash`.

```rust
pub fn start_game(env: Env, player: Address, wager_amount: i128, grid_size: u32, mine_count: u32, board_hash: BytesN<32>) -> Result<u64, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `player` | `Address` |
| `wager_amount` | `i128` |
| `grid_size` | `u32` |
| `mine_count` | `u32` |
| `board_hash` | `BytesN<32>` |

#### Return Type

`Result<u64, Error>`

### `reveal_tile`
Reveal one tile. Safe tiles bump the multiplier; a mine ends the game with zero payout.

```rust
pub fn reveal_tile(env: Env, game_id: u64, player: Address, row: u32, col: u32) -> Result<TileRevealResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `game_id` | `u64` |
| `player` | `Address` |
| `row` | `u32` |
| `col` | `u32` |

#### Return Type

`Result<TileRevealResult, Error>`

### `cashout`
Cash out at the current multiplier, closing the game and paying out `wager_amount * multiplier_bps / 10_000`.

```rust
pub fn cashout(env: Env, game_id: u64, player: Address) -> Result<CashoutResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `game_id` | `u64` |
| `player` | `Address` |

#### Return Type

`Result<CashoutResult, Error>`

### `get_game_summary`
Full game state.

```rust
pub fn get_game_summary(env: Env, game_id: u64) -> Result<MinesweeperSummary, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `game_id` | `u64` |

#### Return Type

`Result<MinesweeperSummary, Error>`

