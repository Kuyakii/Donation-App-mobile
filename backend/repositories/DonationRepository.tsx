import { MariaDBConnection } from '../database/MariaDBConnection';
import { IAssociation } from "../interfaces/IAssociation";
import { IDon } from '../interfaces/IDon';

export class DonationRepository {
    private db: MariaDBConnection;

    constructor() {
        this.db = new MariaDBConnection();
    }

    async donate(idAssos: any, idUtilisateur: any, montant: any, typeDon: any, startDate: any, endDate: any, frequency: any) {
        const connection = await this.db.getConnection();
        try {
            await connection.query(
                'INSERT INTO don (montant, idAssociation, idUtilisateur, dateDon) VALUES (?, ?, ?, SYSDATE())',
                [montant, idAssos, idUtilisateur]
            );

            const [rows]: any = await connection.query(
                'SELECT MAX(idDon) AS idDon FROM don WHERE montant = ? AND idAssociation = ? AND idUtilisateur = ?',
                [montant, idAssos, idUtilisateur]
            );

            const idDon = rows[0]?.idDon;
            if (!idDon) {
                throw new Error("Erreur lors de la récupération de l'ID du don.");
            }

            if (typeDon === 'unique') {
                await connection.query(
                    'INSERT INTO don_unique (idDon) VALUES (?)',
                    [idDon]
                );
            }else{
                await connection.query(
                    'INSERT INTO don_recurrent (idDon, date_Debut, date_Fin, frequence) VALUES (?, ?, ?, ?)',
                    [idDon, startDate, endDate, frequency]
                );
            }

            console.log("Don enregistré avec succès !");

        } catch (error) {
            console.error("Erreur lors de l'insertion du don :", error);
            throw error; // Relancer l'erreur pour gestion en amont

        } finally {
            connection.release();
        }
    }

    async getAll(): Promise<IDon[]> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM V_DONS');
            return rows as IDon[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    async getAssosByAdminAssos(emailAdmin:string): Promise<IDon[]> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('select * from V_DONS where idAssociation = (select aa.idAssociation from admin_association aa where aa.idUtilisateur = (select u.idUtilisateur from utilisateur u where u.email = ?) )', [emailAdmin]);
            return rows as IDon[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    async geDonRecurrentByAssos(emailAdmin:string): Promise<IDon[]> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query("select * from v_dons vd where vd.typeDon COLLATE utf8mb4_unicode_ci = 'RECURRENT' and vd.idAssociation = (SELECT idAssociation FROM admin_association inner join utilisateur on utilisateur.idUtilisateur = admin_association.idUtilisateur where utilisateur.email = ?)", [emailAdmin]);
            return rows as IDon[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    async getMeilleurDonateur(emailAdmin:string): Promise<{ idUtilisateur: number, pseudonyme: string, totalMontant: number }[]> {
        const connection = await this.db.getConnection();
        try {
            const [rows]: any[] = await connection.query("SELECT u.idUtilisateur, CASE WHEN u.pseudonyme = 'Admin' THEN 'Anonyme' ELSE u.pseudonyme END AS pseudonyme, SUM(d.montant) AS totalMontant FROM utilisateur u INNER JOIN don d ON u.idUtilisateur = d.idUtilisateur WHERE d.idAssociation = (SELECT idAssociation FROM admin_association aa INNER JOIN utilisateur u2 ON aa.idUtilisateur = u2.idUtilisateur WHERE u2.email = ?) GROUP BY u.idUtilisateur, u.pseudonyme order by 3 desc", [emailAdmin]);
            return rows as { idUtilisateur: number, pseudonyme: string, totalMontant: number }[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

}
