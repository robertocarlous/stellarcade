const logger = require('../utils/logger');
const GameModel = require('../models/Game.model');
const QuestModel = require('../models/Quest.model');

/**
 * Service for managing game-related business logic.
 */
const gameService = {
  /**
   * Lists games for the public catalog.
   *
   * @returns {Promise<{ games: Array }>}
   */
  listGames: async () => {
    return {
      games: [
        {
          id: 'coinflip-duel',
          name: 'Coinflip Duel',
          status: 'active',
          wager: 5,
          description:
            'Instant 50/50 provably fair on-chain duel. Double your stake on heads or tails.',
          contract: 'coin-flip',
          players: 142,
          category: 'PVP / Duel',
        },
        {
          id: 'rng-dice',
          name: 'Verifiable Dice Roll',
          status: 'active',
          wager: 10,
          description:
            'Multi-sided dice arena backed by cryptographic seed commitments and Soroban RNG.',
          contract: 'random-generator',
          players: 89,
          category: 'Table / RNG',
        },
        {
          id: 'prizepool-gauntlet',
          name: 'Prize Pool Gauntlet',
          status: 'active',
          wager: 25,
          description:
            'High-roller reserve pool with accumulated yields and on-chain payout splits.',
          contract: 'prize-pool',
          players: 37,
          category: 'Jackpot / Pool',
        },
        {
          id: 'rock-paper-scissors',
          name: 'Rock Paper Scissors',
          status: 'active',
          wager: 10,
          description:
            'Commit-reveal PvP hand battle with cryptographic dispute resolution on Soroban.',
          contract: 'rock-paper-scissors',
          players: 64,
          category: 'PVP / Duel',
        },
        {
          id: 'minesweeper-escrow',
          name: 'Minesweeper Escrow',
          status: 'active',
          wager: 15,
          description:
            'Minefield tile clearance with multi-signature stake escrow and cash-out checkpoints.',
          contract: 'minesweeper-escrow',
          players: 48,
          category: 'Strategy / Escrow',
        },
      ],
    };
  },

  /**
   * Fetches recent games with pagination metadata.
   *
   * @param {Object} params - Query parameters
   * @returns {Promise<{items: Array, page: number, pageSize: number, total: number, totalPages: number}>}
   */
  getRecentGames: async (params) => {
    const requestedPage = Math.max(Number(params.page) || 1, 1);
    const cursorPage = Math.max(Number(params.cursor) || requestedPage, 1);
    const effectiveParams = {
      ...params,
      page: cursorPage,
    };

    const { items, total, page, pageSize } = await GameModel.findRecent(effectiveParams);
    const totalPages = Math.ceil(total / pageSize) || 0;
    const nextPage = page < totalPages ? page + 1 : null;
    const nextCursor = nextPage ? String(nextPage) : null;
    const hasNextPage = nextPage !== null;

    return {
      items,
      page,
      pageSize,
      total,
      totalPages,
      pagination: {
        nextCursor,
        hasNextPage,
      },
    };
  },

  /**
   * Ranks players by total payout (winnings), optionally scoped to one game type.
   *
   * @param {Object} params
   * @param {string} [params.gameType]
   * @param {number} [params.limit=10]
   * @returns {Promise<Array<{rank: number, playerAddress: string, score: string}>>}
   */
  getLeaderboard: async ({ gameType, limit = 10 } = {}) => {
    const rows = await GameModel.getLeaderboard({ gameType, limit });
    return rows.map((row, index) => ({
      rank: index + 1,
      playerAddress: row.walletAddress,
      score: String(row.score || 0),
    }));
  },

  /**
   * Real database-backed play outcome and user balance updates.
   *
   * @param {Object} payload
   * @param {number|string} payload.userId
   * @param {string} payload.gameType
   * @param {number} payload.wager
   * @param {string} payload.choice
   * @returns {Promise<{ result: string, win: boolean, payout: number, txHash: string, balance: number }>}
   */
  playSimpleGame: async ({ userId, gameType, wager, choice }) => {
    logger.info(`User ${userId} playing ${gameType} with wager ${wager} and choice ${choice}`);
    const db = require('../config/database');
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }

    const numWager = parseFloat(wager || 0);
    if (parseFloat(user.balance || 0) < numWager) {
      throw new Error('Insufficient balance to place bet.');
    }

    let outcome;
    let won = false;
    let isTie = false;

    const normalizedGameType = String(gameType || 'coinflip').toLowerCase();
    if (normalizedGameType === 'rock-paper-scissors' || normalizedGameType === 'rps') {
      const moves = ['rock', 'paper', 'scissors'];
      const serverMove = moves[require('crypto').randomBytes(1)[0] % 3];
      outcome = serverMove;
      const playerMove = String(choice || 'rock').toLowerCase();
      if (playerMove === serverMove) {
        isTie = true;
        won = false;
      } else if (
        (playerMove === 'rock' && serverMove === 'scissors') ||
        (playerMove === 'paper' && serverMove === 'rock') ||
        (playerMove === 'scissors' && serverMove === 'paper')
      ) {
        won = true;
      } else {
        won = false;
      }
    } else if (
      normalizedGameType === 'minesweeper-escrow' ||
      normalizedGameType === 'minesweeper'
    ) {
      const hitMine = require('crypto').randomBytes(1)[0] % 4 === 0;
      outcome = hitMine ? 'mine' : 'clear';
      won = !hitMine;
    } else {
      outcome = require('crypto').randomBytes(1)[0] % 2 === 0 ? 'heads' : 'tails';
      won = String(choice).toLowerCase() === outcome;
    }

    const payout = won
      ? normalizedGameType.includes('minesweeper')
        ? Number((numWager * 1.5).toFixed(2))
        : numWager * 2
      : isTie
        ? numWager
        : 0;
    const result = won ? 'win' : isTie ? 'tie' : 'loss';

    // Update user balance
    const newBalance = parseFloat(user.balance || 0) - numWager + payout;

    const txHash = '0x' + require('crypto').randomBytes(32).toString('hex');

    // Create DB records
    await GameModel.create({
      user_id: user.id,
      game_type: gameType,
      bet_amount: numWager,
      result: result,
      payout: payout,
      tx_hash: txHash,
    });

    const TransactionModel = require('../models/Transaction.model');
    await TransactionModel.create({
      user_id: user.id,
      type: 'game.play',
      amount: numWager,
      status: 'success',
      tx_hash: txHash,
    });

    await db('users').where({ id: user.id }).update({
      balance: newBalance,
      updated_at: db.fn.now(),
    });

    // Quest progress is a best-effort side effect — must never block or
    // fail an actual wagered game outcome that's already been paid out.
    QuestModel.recordProgress(user.id, 'play-5-games', 1).catch((err) => {
      logger.error('Failed to record play-5-games quest progress:', err);
    });
    if (won) {
      QuestModel.recordProgress(user.id, 'win-3-games', 1).catch((err) => {
        logger.error('Failed to record win-3-games quest progress:', err);
      });
    }

    return {
      result: outcome,
      win: won,
      payout,
      txHash,
      balance: newBalance,
    };
  },
};

module.exports = gameService;
