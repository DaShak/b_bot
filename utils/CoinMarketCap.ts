// CoinMarketCap
const axios = require('axios');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const cmcAPIKey = process.env.CMC_API_KEY;

// https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
export async function getPriceFromCMC() {
    let response = null;
    try {
        response = await axios.get(
            'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1',
            {
                headers: {
                    'X-CMC_PRO_API_KEY': cmcAPIKey,
                },
            }
        );
    } catch(ex) {
        response = null;
        // error
        console.log(ex);
        throw ex;
    }
    if (response) {
        // success
        const json = response.data;
        console.log('getPriceFromCMC response:', json);
        return json;
    }
}

/**
 * Get Asset/Cryptocurrency Map from CoinMarketCap
 * API endpoint doc:  https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
 * BTC = 1
 * ASTRO = 23374   // astroport-fi
 */
export async function getAssetMapFromCMC(symbols?: string) {
    let response = null;
    try {
        let url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
        if (symbols) {
            url += `?symbol=${symbols}`;
        }
        response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': cmcAPIKey,
            },
        });
    } catch(ex) {
        response = null;
        // error
        console.log(ex);
        throw ex;
    }
    if (response) {
        // success
        const json = response.data;
        console.log('getAssetMapFromCMC response:', json);
        return json;
    }
}
