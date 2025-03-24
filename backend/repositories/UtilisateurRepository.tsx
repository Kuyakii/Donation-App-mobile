// src/repositories/UserRepository.ts
import { MariaDBConnection } from '../database/MariaDBConnection';
import { IUtilisateur } from '../interfaces/IUtilisateur';
import { RowDataPacket } from 'mysql2';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
                'INSERT INTO Utilisateur (email, password, pseudonyme) VALUES (?, ?, ?)',
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

    async updatePseudonyme(email: string, newPseudonyme: string): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            await connection.query(
                'UPDATE Utilisateur SET pseudonyme = ? WHERE email = ?',
                [newPseudonyme, email]
            );

        } finally {
            connection.release();
        }
    }

    async getRole(email: string): Promise<string> {
        const connection = await this.db.getConnection();
        try {
            // Récupérer l'idUtilisateur correspondant à l'email
            const [users] = await connection.query<RowDataPacket[]>('SELECT idUtilisateur FROM Utilisateur WHERE email = ?', [email]);

            // Vérifier si l'utilisateur existe
            if (!users || users.length === 0) {
                throw new Error('Utilisateur non trouvé');
            }

            const idUtilisateur = users[0].idUtilisateur;

            // Vérifier si l'utilisateur est un admin_application
            const [adminApp] = await connection.query<RowDataPacket[]>('SELECT * FROM admin_application WHERE idUtilisateur = ?', [idUtilisateur]);
            if (adminApp && adminApp.length > 0) {
                return 'ADMIN_APP';
            }

            // Vérifier si l'utilisateur est un admin_association
            const [adminAsso] = await connection.query<RowDataPacket[]>('SELECT * FROM admin_association WHERE idUtilisateur = ?', [idUtilisateur]);
            if (adminAsso && adminAsso.length > 0) {
                return 'ADMIN_ASSO';
            }

            // Si aucun rôle admin n'est trouvé, retourner 'CITOYEN'
            return 'CITOYEN';
        } catch (error) {
            console.error('Erreur lors de la récupération du rôle :', error);
            throw error; // Propager l'erreur pour la gestion externe
        } finally {
            connection.release(); // Toujours libérer la connexion
        }
    }
}
