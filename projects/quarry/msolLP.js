const { getMultipleAccountBuffers, getConnection, } = require("../helper/solana");
const { PublicKey } = require("@solana/web3.js");

const MSOL_LP_SOL = new PublicKey(
  "UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q"
);
const MSOL_LP_MSOL = new PublicKey(
  "7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE"
);
const MSOL_LP_MINT = new PublicKey(
  "LPmSozJJ8Jh69ut2WP3XmVohTjL4ipR18yiCzxrUmVj"
);

const getMSolLPTokens = async (lpAmount) => {
  const connection = getConnection();
  const accountData = await getMultipleAccountBuffers({
    msolTokens: MSOL_LP_MSOL.toString(),
    poolMint: MSOL_LP_MINT.toString(),
  });

  const solAmount =
    (await connection.getAccountInfo(MSOL_LP_SOL)).lamports / 10 ** 9;
  const msolAmount =
    Number(accountData.msolTokens.readBigUInt64LE(64)) / 10 ** 9;
  const lpSupply =
    Number(accountData.poolMint.readBigUInt64LE(4 + 32)) / 10 ** 9;

  return {
    'solana:mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': (msolAmount * lpAmount) / lpSupply,
    'solana:So11111111111111111111111111111111111111112': (solAmount * lpAmount) / lpSupply,
  };
};

module.exports = {
  MSOL_LP_MINT,
  getMSolLPTokens,
};
