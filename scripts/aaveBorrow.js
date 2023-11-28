const { getNamedAccounts } = require("hardhat");
const { getWeth, AMOUNT } = require("./GETWETH.JS");
const { string } = require("hardhat/internal/core/params/argumentTypes");

async function main() {
  await getWeth();

  const { deployer } = await getNamedAccounts();
  const deployerSigner = await ethers.getSigner(deployer);

  // 0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f lending pool address provider

  const lendingPool = await getLendingPool(deployerSigner);
  console.log("Lending pool address: " + lendingPool.target);

  //deposit
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const daiTokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

  await approve(wethTokenAddress, lendingPool.target, AMOUNT, deployerSigner);
  console.log("Depositing...");
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployerSigner, 0);
  console.log("Deposited");

  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  );
  const price = await getDaiPrice();
  console.log("Dai/Eth price: " + price.toString() / 10 ** 18);
  const amountDaiToBorrow =
    (availableBorrowsETH.toString() * 0.95 * (1 / price.toString())) / 10 ** 18;
  console.log("You can borrow " + amountDaiToBorrow + " DAI");
  const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString());
  await borrow(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer);
  const dai = await ethers.getContractAt(
    "IERC20",
    daiTokenAddress,
    deployerSigner
  );
  console.log(
    "Your DAI amount: " + (await dai.balanceOf(deployer)).toString() / 10 ** 18
  );
  await getBorrowUserData(lendingPool, deployer);

  await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer);
  await getBorrowUserData(lendingPool, deployer);
}

async function getLendingPool(account) {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );
  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  const getTest = await lendingPool.getAddressesProvider();

  return lendingPool;
}

async function approve(contractAddress, spender, amountToSpend, account) {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    contractAddress,
    account
  );

  const tx = await erc20Token.approve(spender, amountToSpend);
  await tx.wait(1);
  console.log("Approved!");
}
async function repay(amount, daiAddress, lendingPool, account) {
  await approve(daiAddress, lendingPool.target, account);
  const repayTx = await lendingPool.repay(daiAddress, amount, 2, account);
  await repayTx.wait(1);
  console.log("Repaid!!");
}

async function borrow(daiAddress, lendingPool, amountDaiToBorrowWei, account) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrowWei,
    2, // Assuming you want variable interest rate
    0, // Referral code, 0 if not applicable
    account
  );
  await borrowTx.wait(1);
  console.log("You've borrowed!");
}
async function getBorrowUserData(lendingPool, account) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);
  console.log("Deposited amount: " + totalCollateralETH);
  console.log("Your debt: " + totalDebtETH);
  console.log("Available ETH to borrow: " + availableBorrowsETH);
  return { availableBorrowsETH, totalDebtETH };
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );
  const price = (await daiEthPriceFeed.latestRoundData())[1];
  const stringPrice = price.toString() / 10 ** 18;
  console.log("Eth/Dai price is: " + 1 / stringPrice);
  return price, stringPrice;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
