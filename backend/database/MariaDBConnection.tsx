import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { IDatabaseConnection } from '../interfaces/IDatabaseConnection';

export class MariaDBConnection implements IDatabaseConnection {
    private pool: Pool;

    private config = {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'donation_app_dev',
    };

    constructor() {
        this.pool = mysql.createPool(this.config);
    }

    async getConnection(): Promise<PoolConnection> {
        const connection = await this.pool.getConnection();
        return connection;  // Retourne la connexion empruntée
    }
}
