# Aave Flashloan Practice on Forked Mainnet

This repository is a practice project for forking the Ethereum mainnet and interacting with decentralized applications on the forked network. In this project, Aave is used to test flashloan functionality on a forked mainnet environment.

## Overview

This project demonstrates how to:
- Fork the Ethereum mainnet for a safe testing environment.
- Interact with Aave's protocol, specifically testing flashloan operations.
- Experiment with dApp interactions in a forked network setup.

## Features

- **Mainnet Forking:** Create a forked Ethereum mainnet for testing without affecting the live network.
- **Flashloan Testing:** Execute and test flashloan operations using Aave.
- **dApp Interactions:** Learn how to interact with popular dApps on a forked mainnet.

## Technologies Used

- **Hardhat:** For creating a forked mainnet environment.
- **Aave Protocol:** To test flashloan operations.
- **Solidity & JavaScript:** For smart contract development and scripting interactions.

## Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/alqeren1/aave-interactions-forked-mainnet.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd aave-interactions-forked-mainnet
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the necessary variables such as your RPC URL, Aave configuration, and any required API keys.

## Usage

1. **Fork the Mainnet:**

   Use Hardhat or Ganache to fork the Ethereum mainnet. For example, using Hardhat:

   ```bash
   npx hardhat node --fork <YOUR_MAINNET_RPC_URL>
   ```

2. **Deploy Contracts and Test Flashloans:**

   Deploy your contracts and run the flashloan scripts:

   ```bash
   npx hardhat run scripts/GETWETH.js --network localhost
   npx hardhat run scripts/aaveBorrow.js --network localhost
   ```

## Learning Outcomes

This project was developed as a practice exercise to:

- Gain hands-on experience with forking the Ethereum mainnet.
- Understand how to interact with Aave for flashloan operations.
- Learn the process of testing decentralized application interactions in a forked network environment.

 

## Contact

For any questions or further discussion, please reach out via [alqeren1](https://github.com/alqeren1) or email [alqeren1@gmail.com](mailto:alqeren1@gmail.com).
