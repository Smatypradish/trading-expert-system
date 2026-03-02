// Market API Service - Fetches real-time cryptocurrency data from CoinGecko

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Popular cryptocurrencies to display by default
export const DEFAULT_CRYPTOS = [
    'bitcoin',
    'ethereum',
    'binancecoin',
    'solana',
    'cardano',
    'ripple',
    'polkadot',
    'dogecoin'
];

/**
 * Fetch market data for multiple cryptocurrencies
 * @param {string[]} ids - Array of coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @param {string} currency - Currency for prices (default: 'usd')
 */
export async function fetchCryptoMarketData(ids = DEFAULT_CRYPTOS, currency = 'usd') {
    try {
        const response = await fetch(
            `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${currency}&ids=${ids.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.map(coin => formatCoinData(coin));
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
}

/**
 * Fetch detailed data for a single cryptocurrency
 * @param {string} id - Coin ID (e.g., 'bitcoin')
 */
export async function fetchCoinDetails(id) {
    try {
        const response = await fetch(
            `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return formatDetailedCoinData(data);
    } catch (error) {
        console.error(`Error fetching details for ${id}:`, error);
        throw error;
    }
}

/**
 * Fetch historical price data for charts
 * @param {string} id - Coin ID
 * @param {number} days - Number of days of history
 */
export async function fetchPriceHistory(id, days = 7) {
    try {
        const response = await fetch(
            `${COINGECKO_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return {
            prices: data.prices.map(([timestamp, price]) => ({
                time: new Date(timestamp),
                price
            })),
            volumes: data.total_volumes.map(([timestamp, volume]) => ({
                time: new Date(timestamp),
                volume
            }))
        };
    } catch (error) {
        console.error(`Error fetching price history for ${id}:`, error);
        throw error;
    }
}

/**
 * Search for cryptocurrencies by name or symbol
 * @param {string} query - Search query
 */
export async function searchCoins(query) {
    try {
        const response = await fetch(
            `${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.coins.slice(0, 10).map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            thumb: coin.thumb,
            marketCapRank: coin.market_cap_rank
        }));
    } catch (error) {
        console.error('Error searching coins:', error);
        throw error;
    }
}

/**
 * Get trending cryptocurrencies
 */
export async function fetchTrendingCoins() {
    try {
        const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.coins.map(item => ({
            id: item.item.id,
            symbol: item.item.symbol,
            name: item.item.name,
            thumb: item.item.thumb,
            marketCapRank: item.item.market_cap_rank,
            priceChange24h: item.item.data?.price_change_percentage_24h?.usd || 0
        }));
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        throw error;
    }
}

/**
 * Format coin data from API response
 */
function formatCoinData(coin) {
    return {
        id: coin.id,
        symbol: coin.symbol?.toUpperCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        last_updated: coin.last_updated
    };
}

/**
 * Format detailed coin data
 */
function formatDetailedCoinData(coin) {
    return {
        id: coin.id,
        symbol: coin.symbol?.toUpperCase(),
        name: coin.name,
        image: coin.image?.large,
        description: coin.description?.en?.slice(0, 500),
        categories: coin.categories,
        links: {
            homepage: coin.links?.homepage?.[0],
            blockchain: coin.links?.blockchain_site?.[0],
            reddit: coin.links?.subreddit_url,
            twitter: coin.links?.twitter_screen_name
        },
        marketData: {
            current_price: coin.market_data?.current_price?.usd,
            market_cap: coin.market_data?.market_cap?.usd,
            market_cap_rank: coin.market_cap_rank,
            total_volume: coin.market_data?.total_volume?.usd,
            high_24h: coin.market_data?.high_24h?.usd,
            low_24h: coin.market_data?.low_24h?.usd,
            price_change_24h: coin.market_data?.price_change_24h,
            price_change_percentage_24h: coin.market_data?.price_change_percentage_24h,
            price_change_percentage_7d: coin.market_data?.price_change_percentage_7d,
            price_change_percentage_30d: coin.market_data?.price_change_percentage_30d,
            ath: coin.market_data?.ath?.usd,
            atl: coin.market_data?.atl?.usd,
            circulating_supply: coin.market_data?.circulating_supply,
            total_supply: coin.market_data?.total_supply
        },
        sentiment: {
            upVotes: coin.sentiment_votes_up_percentage,
            downVotes: coin.sentiment_votes_down_percentage
        },
        lastUpdated: coin.last_updated
    };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2);
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price) {
    if (!price) return '$0.00';
    if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (price >= 1) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (price >= 0.01) return '$' + price.toFixed(4);
    return '$' + price.toFixed(6);
}
