const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")
const { networkConfig,developmentChains } = require("../../helper-hardhat-config")
//sadece local chain testi
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit tests", function () {
          let raffle, vrfCoordinatorV2Mock,chainId,interval
          let deployer
          let mockV3Aggregator
          let balance
          let alienAccount
          let raffleEntranceFee
          //const sendValue = 1 * 10 ** 18
          beforeEach(async function () {
              // Get the account to deploy the contracts with
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              alienAccount = accounts[1]
              chainId = network.config.chainId
              // Deploy all contracts using the tags specified in the deployment scripts
              await deployments.fixture(["all"])

              // Get the contract instances
              // ethers.getContract returns a contract instance connected to the first signer by default,
              // which is usually the deployer when using `getNamedAccounts`
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()

              mockV3Aggregator = await deployments.get("VRFCoordinatorV2Mock")
          })

          describe("constructor", function () {
              it("Initializes raffle correctly", async function () {
                  // Call the getPriceFeed function from the FundMe contract
                  const raffleState = await raffle.getRaffleState()
                  const interval_ = await raffle.getInterval()
                  // Use expect from Chai for assertions as it provides more informative error messages
                  assert.equal(raffleState.toString(), "0") //means OPEN because its enum
                  assert.equal(interval_.toString(), networkConfig[chainId]["interval"]) 
              })
          })
          describe("enter raffle", async function () {
              it("reverts when you don't pay enough", async function () {
                await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
                    raffle, "Raffle__NotEnoughETHentered")
              })

              it("records players when entered", async function () {
                const connecting = await raffle.connect(alienAccount)
                  await connecting.enterRaffle({ value: raffleEntranceFee })
                  const response = await raffle.getPlayer(0)
                  assert.equal(response.toString(), alienAccount.address.toString())
              })
              it("emits event on enter", async function () {
                  expect(await raffle.enterRaffle({value: raffleEntranceFee})).to.emit(raffle, "RaffleEnter")
              })
              it("doesn't accept entrance when raffle is calculating", async function () {
                //büyük ihtimalle istek atmak için gerekli olan Lınk token olmadığı için çalışmıyor, sepoliada link ile denemek lazım
                await raffle.enterRaffle({value: raffleEntranceFee})  
                await network.provider.send("evm_increaseTime",[Number(interval)+1])
                await network.provider.send("evm_mine")
                await raffle.performUpkeep('0x')
                await expect(raffle.enterRaffle({value: raffleEntranceFee})).to.be.revertedWithCustomError(
                    raffle, "Raffle__NotOpen")
            })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Owner withdraws the money with a single funder", async function () {
                  //balance = await ethers.provider.getBalance(fundMe)

                  await fundMe.withdraw()
                  //const owner = await fundMe.i_owner()

                  balance = await ethers.provider.getBalance(fundMe)
                  //await console.log("Value:" + ethers.formatEther(balance))
                  assert.equal(balance.toString(), "0")
              })
              it("Owner withdraws the money with multiple getFunder", async function () {
                  const account = await ethers.getSigners()

                  for (i = 1; i < 7; i++) {
                      const connecting = await fundMe.connect(account[i])

                      await connecting.fund({ value: sendValue })
                  }

                  const ownerconnect = await fundMe.connect(deployer)

                  await ownerconnect.withdraw()
                  //balance = await ethers.provider.getBalance(fundMe)

                  //await console.log("Value:" + balance)

                  assert.equal(balance.toString(), "0")
              })
              it("Public can't withdraw the money", async function () {
                  const fundMeConnect = fundMe.connect(alienAccount)
                  //await fundMeConnect.withdraw()
                  await expect(fundMeConnect.withdraw()).to.be.reverted
              })
          })
          // Add more tests as needed
      })
