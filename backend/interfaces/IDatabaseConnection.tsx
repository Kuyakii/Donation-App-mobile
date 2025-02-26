import {PoolConnection} from "mysql2/promise";

export interface IDatabaseConnection {
    getConnection(): Promise<PoolConnection>
}
