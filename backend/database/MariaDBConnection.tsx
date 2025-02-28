import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { IDatabaseConnection } from '../interfaces/IDatabaseConnection';
import {config} from "../config";

export class MariaDBConnection implements IDatabaseConnection {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool(config);
    }

    async getConnection(): Promise<PoolConnection> {
        const connection = await this.pool.getConnection();
        return connection;  // Retourne la connexion empruntée
    }
}
