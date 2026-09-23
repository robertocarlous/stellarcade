# token-streaming

## Public Methods

### `create_stream`
```rust
pub fn create_stream(env: Env, sender: Address, recipient: Address, deposit: u128, start_ts: u64, stop_ts: u64) -> u64
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `sender` | `Address` |
| `recipient` | `Address` |
| `deposit` | `u128` |
| `start_ts` | `u64` |
| `stop_ts` | `u64` |

#### Return Type

`u64`

### `withdraw_from_stream`
```rust
pub fn withdraw_from_stream(env: Env, stream_id: u64, recipient: Address, amount: u128) -> u128
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `stream_id` | `u64` |
| `recipient` | `Address` |
| `amount` | `u128` |

#### Return Type

`u128`

### `cancel_stream`
Cancels the stream, splitting the deposit by exact elapsed seconds: the recipient's vested-but-unwithdrawn share, and the sender's remaining unvested share. Returns (sender_refund, recipient_payout).

```rust
pub fn cancel_stream(env: Env, stream_id: u64, caller: Address) -> (u128, u128)
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `stream_id` | `u64` |
| `caller` | `Address` |

#### Return Type

`(u128, u128)`

### `get_stream`
```rust
pub fn get_stream(env: Env, stream_id: u64) -> StreamSummary
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `stream_id` | `u64` |

#### Return Type

`StreamSummary`

### `get_available_balance`
```rust
pub fn get_available_balance(env: Env, stream_id: u64) -> u128
```

#### Parameters

| Name | Type |
|------|------|
| `env` | `Env` |
| `stream_id` | `u64` |

#### Return Type

`u128`

