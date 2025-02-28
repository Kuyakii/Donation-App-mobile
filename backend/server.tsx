import express, { Request, Response } from 'express';
import cors from 'cors';
import { MariaDBConnection } from './database/MariaDBConnection';
import { AssociationRepository } from './repositories/AssociationRepository';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Instanciation des classes
const associationRepository = new AssociationRepository();

// Routes
app.get('/associations', async (req: Request, res: Response) => {
    try {
        const associations = await associationRepository.findAll();
        res.json(associations);
    } catch (error) {
        console.error('Erreur lors de la récupération des associations', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/associations/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const association = await associationRepository.findById(Number(id));
        if (association) {
            res.json(association);
        } else {
            res.status(404).send('Association non trouvée');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'association', error);
        res.status(500).send('Erreur serveur');
    }
});

app.post('/associations', async (req: Request, res: Response) => {
    const { nom, description, localisation, idType } = req.body;
    try {
        const newAssociation = { nom, description, localisation, idType };
        await associationRepository.create(newAssociation);
        res.status(201).send('Association créée');
    } catch (error) {
        console.error('Erreur lors de la création de l\'association', error);
        res.status(500).send('Erreur serveur');
    }
});

app.put('/associations/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, description, localisation } = req.body;
    try {
        const updatedAssociation = { nom, description, localisation };
        await associationRepository.update(Number(id), updatedAssociation);
        res.send('Association mise à jour');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'association', error);
        res.status(500).send('Erreur serveur');
    }
});

// Lancer le serveur
app.listen(port,'0.0.0.0', () => {
    console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
