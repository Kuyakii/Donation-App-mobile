import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AssociationRepository } from './repositories/AssociationRepository';
import { UtilisateurRepository } from './repositories/UtilisateurRepository';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Instanciation des classes
const associationRepository = new AssociationRepository();
const userRepo = new UtilisateurRepository();
const JWT_SECRET = 'votre_secret_jwt'; // À remplacer par une clé sécurisée

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

// Route pour l'inscription
app.post('/register', async (req: Request, res: Response) => {
    const { email, password, pseudonyme } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
        res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    await userRepo.create({ email, password: hashedPassword, pseudonyme });

    res.status(201).json({ message: 'Utilisateur inscrit avec succès.' });
});

// Route pour la connexion
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await userRepo.findByEmail(email);
    if (!user) {
        res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    // @ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer un token JWT
    // @ts-ignore
    const token = jwt.sign({ id: user.idUtilisateur, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
});

// Route pour le mot de passe oublié
app.post('/mdpOublie', async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    // Trouver l'utilisateur par email
    const user = await userRepo.findByEmail(email);
    if (!user) {
        res.status(400).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await userRepo.updatePassword(email, hashedPassword);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
});

// Lancer le serveur
app.listen(port,'0.0.0.0', () => {
    console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
