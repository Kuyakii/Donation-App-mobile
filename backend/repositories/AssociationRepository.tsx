import { MariaDBConnection } from '../database/MariaDBConnection';
import { IAssociation } from '../interfaces/IAssociation';

export class AssociationRepository {
    private db: MariaDBConnection;

    constructor() {
        this.db = new MariaDBConnection();
    }

    // Récupérer toutes les associations
    async findAll(): Promise<IAssociation[]> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Association');
            return rows as IAssociation[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Récupérer toutes les associations favorites d'un user
    async findAllFavorites(idUtilisateur: number): Promise<IAssociation[] | undefined> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Association WHERE idAssociation in ( SELECT idAssociation FROM AssociationsFavorites WHERE idUtilisateur = ?) ', [idUtilisateur]);
            return rows as IAssociation[];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Récupérer une association par son ID
    async findById(idAssociation: number): Promise<IAssociation | undefined> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM Association WHERE idAssociation = ?', [idAssociation]);
            return (rows as IAssociation[])[0];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Ajouter une nouvelle association
    async create(association: Omit<IAssociation, 'idAssociation'>): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            const { nom, description,descriptionCourte,nomImage, localisation, idType } = association;
            await connection.query(
                'INSERT INTO Association (nom, description,descriptionCourte,nomImage, localisation, idType) VALUES (?, ?, ?, ?, ?, ?)',
                [nom, description,descriptionCourte,nomImage, localisation, idType]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Modifier une association existante
    async update(idAssociation: number, association: Partial<IAssociation>): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            const { nom, description,descriptionCourte,nomImage, localisation, idType } = association;
                await connection.query(
                'UPDATE Association SET nom = ?, description = ?,descriptionCourte = ? WHERE idAssociation = ?',
                [nom, description,descriptionCourte, idAssociation]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    async addFavoriteAsso(newAssoFavorite: { idUtilisateur: number; idAssociation: number }) {
        const connection = await this.db.getConnection();
        try {
            const { idUtilisateur, idAssociation } = newAssoFavorite;
            await connection.query(
                'INSERT INTO AssociationsFavorites (idUtilisateur, idAssociation) VALUES (?, ?)',
                [idUtilisateur, idAssociation]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    async deleteFavoriteAsso(assoFavorite: { idUtilisateur: any; idAssociation: any }) {
        const connection = await this.db.getConnection();
        try {
            const { idUtilisateur, idAssociation } = assoFavorite;
            await connection.query(
                'DELETE FROM AssociationsFavorites WHERE idUtilisateur = ? AND idAssociation = ?',
                [idUtilisateur, idAssociation]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Récupérer toutes les associations favorites d'un admin application
    async findFavoritesByAssos(email: string): Promise<number> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT COUNT(a.idUtilisateur) AS nbAssosFav
             FROM associationsfavorites a
             WHERE a.idAssociation = (
                 SELECT aa.idAssociation
                 FROM admin_association aa
                 INNER JOIN utilisateur u ON aa.idUtilisateur = u.idUtilisateur
                 WHERE u.email = ?
             )`,
                [email]
            );

            // @ts-ignore
            return rows[0]?.nbAssosFav || 0;
        } finally {
            connection.release();
        }
    }

    // Récupérer une association par le mail de son admin
    async findByAdmin(email: string): Promise<IAssociation | undefined> {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query('SELECT a.idAssociation, a.nom, a.description, a.descriptionCourte, a.nomImage, a.localisation, a.idType FROM Association a inner join Admin_association aa on a.idAssociation = aa.idAssociation inner join utilisateur u on u.idUtilisateur = aa.idUtilisateur WHERE u.email = ?', [email]);
            return (rows as IAssociation[])[0];
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

}
