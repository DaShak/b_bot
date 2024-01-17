import { Squid } from "@0xsquid/sdk";
import { TokenData, ChainData } from '@0xsquid/sdk/dist/types';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const integratorId = process.env.INTEGRATOR_ID;
const baseUrl = process.env.BASE_URL;

// Make sure integratorId and baseUrl are defined
if (!integratorId || !baseUrl) {
  throw new Error('INTEGRATOR_ID and BASE_URL must be defined in the .env file');
}

(async () => {
  // instantiate the SDK
  const squid = new Squid({
    // baseUrl: "https://testnet.api.squidrouter.com",
    baseUrl: baseUrl,
    integratorId: integratorId,
  });

  // squid.setConfig();

  // init the SDK
  await squid.init();
  console.log("Squid inited");

  const tokens = squid.tokens as TokenData[]
  const chains = squid.chains as ChainData[]

  // set fromToken to USDC on Axelar
  const fromToken = squid.tokens.find(
    t =>
      t.symbol === "ETH" &&
      t.chainId === squid.chains.find(c => c.chainName === "Ethereum")?.chainId
  );
  console.log("fromToken USDC on Axelar", fromToken);

  // set toToken to ETH on Ethereum
  const toToken = squid.tokens.find(
    t =>
      t.symbol === "USDC" &&
      t.chainId === squid.chains.find(c => c.chainName === "terra-2")?.chainId
  );
  console.log("toToken ETH on Ethereum", toToken);

  if (fromToken && toToken) {

    const params = {
      fromChain: fromToken.chainId,
      fromToken: fromToken.address,
      fromAmount: ethers.utils.parseEther('0.1').toString(), // Convert to wei
      toChain: toToken.chainId,
      toToken: toToken.address,
      fromAddress: "0xAD3A87a43489C44f0a8A33113B2745338ae71A9D", // ethers.signer.address; transaction sender address
      toAddress: "0xAD3A87a43489C44f0a8A33113B2745338ae71A9D", // the recipient of the trade
      slippage: 1.00, // 1.00 = 1% max slippage across the entire route
      enableForecall: false, // instant execution service, defaults to true
      quoteOnly: true // optional, defaults to false
    };

    console.log("Trying these params:", params);

    const { route, requestId, integratorId  } = await squid.getRoute(params);

    console.log("the `route` response:", route);

  } else {
    console.log("fromToken or toToken not found");
    throw new Error('fromToken or toToken not found');
  }


})();


/*

Chains:  https://api.squidrouter.com/v1/chains
Tokens:  https://api.squidrouter.com/v1/tokens


Example params for a transfer:

const params = {
  fromChain: 5, // Goerli testnet
  fromToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // WETH on Goerli
  fromAmount: "50000000000000000", // 0.05 WETH
  toChain: 43113, // Avalanche Fuji Testnet
  toToken: "0x57f1c63497aee0be305b8852b354cec793da43bb", // aUSDC on Avalanche Fuji Testnet
  fromAddress: "0xAD3A87a43489C44f0a8A33113B2745338ae71A9D", // ethers.signer.address; transaction sender address
  toAddress: "0xAD3A87a43489C44f0a8A33113B2745338ae71A9D", // the recipient of the trade
  slippage: 1.00, // 1.00 = 1% max slippage across the entire route
  enableForecall: true, // instant execution service, defaults to true
  quoteOnly: false // optional, defaults to false
};
*/