// CoinMarketCap
const axios = require('axios');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const cmcAPIKey = process.env.CMC_API_KEY;

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
