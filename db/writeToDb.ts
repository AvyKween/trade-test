import fs from "fs";
import { join } from "path";

interface Pool {
    BTC: number;
    ETH: number;
    USDT: number;
    [ key: string ]: number;
}

const dbPath = join('./db/database.json')

if ( !fs.existsSync( dbPath ) ) { 
    fs.writeFileSync(dbPath, '[]', 'utf-8')
}

export const writeToDb = (pool: Pool) => {
    const db: Pool[] = JSON.parse( fs.readFileSync(dbPath, 'utf-8') )

    const newDb = [
        ...db,
        pool
    ]

    fs.writeFileSync( dbPath, JSON.stringify( newDb, null, 2 ), 'utf-8')

    return
}
