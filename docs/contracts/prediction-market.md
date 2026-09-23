# prediction-market

## Public Methods

### `create_market`
Open a binary market seeded with `initial_collateral` of YES and NO reserves (50/50 start). `creator` is the designated resolver.

```rust
pub fn create_market(env: Env, creator: Address, title: String, expiry_ts: u64, initial_collateral: u128) -> Result<u64, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `creator` | `Address` |
| `title` | `String` |
| `expiry_ts` | `u64` |
| `initial_collateral` | `u128` |

#### Return Type

`Result<u64, Error>`

### `buy_shares`
Buy YES or NO shares against the CPMM. Returns shares received.

```rust
pub fn buy_shares(env: Env, market_id: u64, trader: Address, outcome_is_yes: bool, investment_amount: u128, min_shares: u128) -> Result<u128, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `market_id` | `u64` |
| `trader` | `Address` |
| `outcome_is_yes` | `bool` |
| `investment_amount` | `u128` |
| `min_shares` | `u128` |

#### Return Type

`Result<u128, Error>`

### `sell_shares`
Sell YES or NO shares back to the CPMM. Returns collateral payout.

```rust
pub fn sell_shares(env: Env, market_id: u64, trader: Address, outcome_is_yes: bool, shares_amount: u128, min_payout: u128) -> Result<u128, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `market_id` | `u64` |
| `trader` | `Address` |
| `outcome_is_yes` | `bool` |
| `shares_amount` | `u128` |
| `min_payout` | `u128` |

#### Return Type

`Result<u128, Error>`

### `resolve_market`
Oracle resolution: `resolver` must be the market creator.

```rust
pub fn resolve_market(env: Env, market_id: u64, winning_is_yes: bool, resolver: Address) -> Result<(), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `market_id` | `u64` |
| `winning_is_yes` | `bool` |
| `resolver` | `Address` |

#### Return Type

`Result<(), Error>`

### `redeem_winnings`
Redeem winning shares 1:1 for collateral. Losing shares expire.

```rust
pub fn redeem_winnings(env: Env, market_id: u64, trader: Address) -> Result<u128, Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `market_id` | `u64` |
| `trader` | `Address` |

#### Return Type

`Result<u128, Error>`

### `get_market_prices`
Spot YES/NO prices in basis points (always sum to 10_000).

```rust
pub fn get_market_prices(env: Env, market_id: u64) -> Result<(u32, u32), Error>
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `market_id` | `u64` |

#### Return Type

`Result<(u32, u32), Error>`

