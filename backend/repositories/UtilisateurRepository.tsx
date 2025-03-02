// src/repositories/UserRepository.ts
import { MariaDBConnection } from '../database/MariaDBConnection';
import { IUtilisateur } from '../interfaces/IUtilisateur';

export class UtilisateurRepository {
    private db: MariaDBConnection;

    constructor() {
        this.db = new MariaDBConnection();
    }

    // Trouver un utilisateur par email
    async findByEmail(email: string): Promise<IUtilisateur | undefined> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
            return (rows as IUtilisateur[])[0];
        } finally {
            connection.release();
        }
    }

    // Créer un nouvel utilisateur
    async create(user: Omit<IUtilisateur, 'idUtilisateur'>): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            const { email, password, pseudonyme } = user;
            await connection.query(
                'INSERT INTO Utilisateur (email, password, Pseudonyme) VALUES (?, ?, ?)',
                [email, password, pseudonyme]
            );
            const invite = await this.findByEmail(email);
            // @ts-ignore
            const iduser = invite.idUtilisateur;
            await connection.query(
                'INSERT INTO Citoyen (idUtilisateur) VALUES (?)',
                [iduser]
            );
        } finally {
            connection.release();
        }
    }

    // Mettre à jour le mot de passe d'un utilisateur
    async updatePassword(email: string, newPassword: string): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            await connection.query(
                'UPDATE Utilisateur SET password = ? WHERE email = ?',
                [newPassword, email]
            );
        } finally {
            connection.release();
        }
    }
}
