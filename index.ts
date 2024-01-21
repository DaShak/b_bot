import { ethers } from 'ethers';
import { getAssetMapFromCMC, getPriceFromCMC } from './utils/CoinMarketCap';
import { SquidRouter } from './utils/SquidRouter';

/**
 * Experiment with SquidRouter SDK & API
 */
async function experimentSquidRouter() {
  // Instantiate SquidRouter class
  const squid = new SquidRouter();
  await squid.initialize();

  console.log("squid.squid.tokens:", squid.squid.tokens);
  // set fromToken to USDC on Axelar
  const fromToken = squid.squid.tokens.find(
    t =>
      t.symbol === "ETH" &&
      t.chainId === squid.squid.chains.find(c => c.chainName === "Ethereum")?.chainId
  );
  console.log("fromToken USDC on Axelar", fromToken);

  // set toToken to ETH on Ethereum
  const toToken = squid.squid.tokens.find(
    t =>
      t.symbol === "USDC" &&
      t.chainId === squid.squid.chains.find(c => c.chainName === "terra-2")?.chainId
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

    const { route, requestId, integratorId  } = await squid.squid.getRoute(params);

    console.log("the `route` response:", route);

  } else {
    console.log("fromToken or toToken not found");
    throw new Error('fromToken or toToken not found');
  }
}

/**
 * Experiment with CoinMarketCap API
 */
async function experimentCoinMarketCap() {
  // get Asset Map from CoinMarketCap
  // console.log("Trying getAssetMapFromCMC('BTC,ASTRO')");
  // const cmcAssetMap = await getAssetMapFromCMC('BTC,ASTRO');
  // console.log("cmcAssetMap:", cmcAssetMap);

  // get price of BTC (id=1) in USD from CoinMarketCap
  const testPriceFromCMC = await getPriceFromCMC('1', 'USD');
  // console.log("testPriceFromCMC:", testPriceFromCMC);
  // console.log("testPriceFromCMC.data:", testPriceFromCMC.data);
  console.log("testPriceFromCMC.data.BTC[0].quote:", testPriceFromCMC.data['1'].quote.USD);

  // get price of ASTRO (id=23374) in USD from CoinMarketCap
  const astroPriceFromCMC = await getPriceFromCMC('23374');
  // console.log("astroPriceFromCMC.data:", astroPriceFromCMC.data);
  console.log("astroPriceFromCMC.data.BTC[0].quote:", astroPriceFromCMC.data['23374'].quote);
}

/**
 * Main
 */
(async () => {

  // SquidRouter experiment
  await experimentSquidRouter();

  // CoinMarketCap experiment
  await experimentCoinMarketCap();

})();
