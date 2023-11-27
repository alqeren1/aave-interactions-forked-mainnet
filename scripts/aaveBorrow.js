const { getNamedAccounts } = require("hardhat");
const { getWeth, AMOUNT } = require("./GETWETH.JS");

async function main() {
  await getWeth();

  const { deployer } = await getNamedAccounts();
  const deployerSigner = await ethers.getSigner(deployer);

  // 0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f lending pool address provider

  const lendingPool = await getLendingPool(deployerSigner);
  console.log("Lending pool address: " + lendingPool.target);

  //deposit
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  await approve(wethTokenAddress, lendingPool.target, AMOUNT, deployerSigner);
  console.log("Depositing...");
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployerSigner, 0);
  console.log("Deposited");
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
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
