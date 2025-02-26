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
            const { nom, description, localisation } = association;
            await connection.query(
                'INSERT INTO Association (nom, description, localisation) VALUES (?, ?, ?)',
                [nom, description, localisation]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }

    // Modifier une association existante
    async update(idAssociation: number, association: Partial<IAssociation>): Promise<void> {
        const connection = await this.db.getConnection();
        try {
            const { nom, description, localisation } = association;
            await connection.query(
                'UPDATE Association SET nom = ?, description = ?, localisation = ? WHERE idAssociation = ?',
                [nom, description, localisation, idAssociation]
            );
        } finally {
            connection.release(); // Libérer la connexion
        }
    }
}
