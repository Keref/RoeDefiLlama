const utils = require('../helper/utils');
const { toUSDTBalances } = require('../helper/balances');
const { staking } = require('../helper/staking');

async function tvl() {
    let tvl = 0;
    const pools = await utils.fetchURL('https://comb-breakdown.herokuapp.com/pools');
    const vaults = await utils.fetchURL('https://comb-breakdown.herokuapp.com/vaults');


    pools.data.forEach(pool => tvl += pool.tvl);
    vaults.data.forEach(vault => tvl += vault.tvl);

    return toUSDTBalances(tvl);
}

module.exports = {
  timetravel: false,
  methodology: 'Fetches pools (masterchef), vaults, and zcomb data from external APIs and sums up the total locked values (TVL). The TVLs are calculated by taking the lp balances and its price of the strategies and adding them up. The zcomb tvl is calculated by taking the total locked comb and multiplying it by its market value.',
  fantom: {
    tvl,
    staking: staking('0xdecce40d4176abefb4c709b2220c8396fe710cf7', '0xae45a827625116d6c0c40b5d7359ecf68f8e9afd', 'fantom'),
  }
}
