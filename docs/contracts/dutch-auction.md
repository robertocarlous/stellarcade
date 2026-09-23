# dutch-auction

## Public Methods

### `initialize`
One-time setup: admin and the token buyers pay in.

```rust
pub fn initialize(env: Env, admin: Address, payment_token: Address) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `admin` | `Address` |
| `payment_token` | `Address` |

#### Return Type

`Result<(), Error>`

### `create_auction`
Create a new descending-price auction. Returns the new auction's id.

```rust
pub fn create_auction(env: Env, seller: Address, token_id: u64, start_price: i128, floor_price: i128, start_ts: u64, duration_sec: u64) -> Result<u64, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `seller` | `Address` |
| `token_id` | `u64` |
| `start_price` | `i128` |
| `floor_price` | `i128` |
| `start_ts` | `u64` |
| `duration_sec` | `u64` |

#### Return Type

`Result<u64, Error>`

### `buy`
Buy at the current price. `max_payment` caps what the buyer is willing to pay (protects against the price rising between building and submitting the transaction, though this contract's price only ever falls). Any amount above the current price is refunded. Returns the amount actually paid.

```rust
pub fn buy(env: Env, auction_id: u64, buyer: Address, max_payment: i128) -> Result<i128, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |
| `buyer` | `Address` |
| `max_payment` | `i128` |

#### Return Type

`Result<i128, Error>`

### `cancel_auction`
Cancel an unsold auction after it has fully decayed to the floor price for at least `duration_sec` (i.e. the auction has expired). Only the seller may cancel.

```rust
pub fn cancel_auction(env: Env, auction_id: u64, seller: Address) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |
| `seller` | `Address` |

#### Return Type

`Result<(), Error>`

### `get_current_price`
The current price of an active auction.

```rust
pub fn get_current_price(env: Env, auction_id: u64) -> Result<i128, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |

#### Return Type

`Result<i128, Error>`

### `get_auction`
Full auction state.

```rust
pub fn get_auction(env: Env, auction_id: u64) -> Result<DutchAuctionSummary, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |

#### Return Type

`Result<DutchAuctionSummary, Error>`

