const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE= ethers.parseEther("0.25")
const GAS_PRICE_LINK= 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const artifact = require('../artifacts/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol/VRFCoordinatorV2Mock.json');
    let vrfCoordinatorV2Address

    if (developmentChains.includes(network.name)) {
        //log("local network detected.deploying mocks")
        args = [BASE_FEE,GAS_PRICE_LINK]
        const mock = await deploy('VRFCoordinatorV2Mock', {
            contract: {
                abi: artifact.abi,
                bytecode: artifact.bytecode
            },
            from: deployer,
            log: true,
            args: args,
        })
        //log("Mock Deployed...")
        //log("--------------------------------")
        //log(`Deployed at ${mock.address}`);
        //log("--------------------------------");
    }
}

module.exports.tags = ["all", "mocks"]
