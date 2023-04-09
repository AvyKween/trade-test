import axios from 'axios';
import { writeToDb } from './db/writeToDb';

type Operation = 'BUY' | 'SELL';
type Pair = 'BTC/USDT' | 'ETH/BTC' | 'ETH/USDT';

interface Pool {
    BTC: number;
    ETH: number;
    USDT: number;
    [ key: string ]: number;
}

const getPairData = async(pair: Pair) => {
    const symbol = pair.split('/').join('')

    try {
        const { data } = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${ symbol }&interval=1s&limit=1`)
        return data[0][4]        
    
    } catch (error) {
        console.log(error);
    }
}

const Trade = async(operation : Operation, pair: Pair, quantity: number | 'max', pool: Pool ) => {

    const price = await getPairData(pair)
    const [ leftPair, rightPair ] = pair.split('/')
    const newPool = pool
    let max;

    if ( operation === "BUY") {
        if ( quantity === "max" ) {
            max = pool[rightPair]
            newPool[leftPair] = + ( pool[leftPair] + ( max / price) ).toFixed(8);
            newPool[rightPair] = + ( pool[rightPair] - max ).toFixed(8);
            return writeToDb(newPool)
        }
        newPool[leftPair] = + ( pool[leftPair] + quantity ).toFixed(8);
        newPool[rightPair] = + ( pool[rightPair] - ( price * quantity ) ).toFixed(8)
        return writeToDb(newPool)
    }
    
    if ( operation === "SELL") {
        if ( quantity === "max" ) {
            max = pool[leftPair]
            newPool[leftPair] = + ( pool[leftPair] - max ).toFixed(8);
            newPool[rightPair] = + ( pool[rightPair] + ( max * price ) ).toFixed(8);
            return writeToDb(newPool)
        }
        newPool[leftPair] = + ( pool[leftPair] - quantity ).toFixed(8);
        newPool[rightPair] = + ( pool[rightPair] + ( price * quantity ) ).toFixed(8)
        return writeToDb(newPool)
    }
}


const Account: Pool = { 
    BTC: 1, 
    ETH: 0, 
    USDT: 0 
}

// Trade('BUY', 'BTC/USDT', 'max', Account)
Trade('BUY', 'ETH/BTC', 'max', Account)
// Trade('SELL', 'ETH/USDT', 'max', Account)