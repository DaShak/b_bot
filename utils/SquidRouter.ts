import dotenv from 'dotenv';
import { Squid } from "@0xsquid/sdk";
// import { TokenData, ChainData } from '@0xsquid/sdk/dist/types';

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const integratorId = process.env.INTEGRATOR_ID;
const baseUrl = process.env.BASE_URL;

// Make sure integratorId and baseUrl are defined
if (!integratorId || !baseUrl) {
  throw new Error('INTEGRATOR_ID and BASE_URL must be defined in the .env file');
}

/**
 * SquidRouter
 */
export class SquidRouter {
//   public tokens: TokenData[];
//   public chains: ChainData[];
  public squid: Squid;

    constructor() {
        // this.tokens = [];
        // this.chains = [];
        this.squid = new Squid({
            // baseUrl: "https://testnet.api.squidrouter.com",
            baseUrl: baseUrl,
            integratorId: integratorId,
        });
    }

    public async initialize(): Promise<void> {
    
        // instantiate the SquidRouter SDK

        // squid.setConfig();

        // init the SDK
        await this.squid.init();
        console.log("Squid inited");

        // this.tokens = this.squid.tokens as TokenData[]
        // this.chains = this.squid.chains as ChainData[]

    }

}

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