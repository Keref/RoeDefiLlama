const { get } = require('../helper/http')
const BigNumber = require("bignumber.js");
const { toUSDTBalances } = require('../helper/balances');

async function fetchLiquidity() {
  const klayswapInfo = await get('https://s.klayswap.com/stat/klayswapInfo.json')
  const recentPoolInfo = klayswapInfo.recentPoolInfo;
  var totalLiquidity = new BigNumber('0');

  for (const pool of recentPoolInfo) {
    totalLiquidity = totalLiquidity.plus(pool.poolVolume);
  }

  // Single-sided deposits
  const SinglePoolInfo = klayswapInfo.leveragePoolInfo.single;
  var totalSingleSided = new BigNumber('0');

  for (const spool of SinglePoolInfo) {
    totalSingleSided = totalSingleSided.plus(spool.totalDepositVol);
  }

  return toUSDTBalances(totalLiquidity.plus(totalSingleSided).toFixed(2));
}


async function fetchStakedToken() {
  const klayswapInfo = await get('https://s.klayswap.com/stat/klayswapInfo.json')
  var totalStaking = new BigNumber(klayswapInfo.common.stakingVol);
  return toUSDTBalances(totalStaking.toFixed(2));
}

module.exports = {
  methodology: 'TVL counts the liquidity of KlaySwap DEX and staking counts the KSP that has been staked. Data is pulled from:"https://s.klayswap.com/stat/klayswapInfo.json".',
  klaytn: {
    tvl: fetchLiquidity,
    staking: fetchStakedToken
  },
  misrepresentedTokens: true,
  timetravel: false,
}