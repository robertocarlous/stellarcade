# blind-auction

## Public Methods

### `initialize`
One-time setup: payment token and protocol fee in basis points.

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

### `create_auction`
```rust
pub fn create_auction(env: Env, seller: Address, reserve_price: i128, bidding_end_ts: u64, reveal_end_ts: u64) -> Result<u64, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `seller` | `Address` |
| `reserve_price` | `i128` |
| `bidding_end_ts` | `u64` |
| `reveal_end_ts` | `u64` |

#### Return Type

`Result<u64, Error>`

### `commit_bid`
```rust
pub fn commit_bid(env: Env, auction_id: u64, bidder: Address, commitment: BytesN<32>, deposit_amount: i128) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |
| `bidder` | `Address` |
| `commitment` | `BytesN<32>` |
| `deposit_amount` | `i128` |

#### Return Type

`Result<(), Error>`

### `reveal_bid`
```rust
pub fn reveal_bid(env: Env, auction_id: u64, bidder: Address, bid_amount: i128, salt: BytesN<32>) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |
| `bidder` | `Address` |
| `bid_amount` | `i128` |
| `salt` | `BytesN<32>` |

#### Return Type

`Result<(), Error>`

### `settle_auction`
```rust
pub fn settle_auction(env: Env, auction_id: u64) -> Result<AuctionResult, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |

#### Return Type

`Result<AuctionResult, Error>`

### `get_auction_state`
```rust
pub fn get_auction_state(env: Env, auction_id: u64) -> Result<AuctionSummary, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `auction_id` | `u64` |

#### Return Type

`Result<AuctionSummary, Error>`

### `commitment_hash`
`sha256(bid_amount.to_be_bytes() || salt)`.

```rust
pub fn commitment_hash(env: &Env, bid_amount: i128, salt: &BytesN<32>) -> BytesN<32>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `&Env` |
| `bid_amount` | `i128` |
| `salt` | `&BytesN<32>` |

#### Return Type

`BytesN<32>`

