import express, { Request, Response } from 'express';
import QRCode from "qrcode";
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AssociationRepository } from './repositories/AssociationRepository';
import { UtilisateurRepository } from './repositories/UtilisateurRepository';
import {DonationRepository} from "./repositories/DonationRepository";


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Instanciation des classes
const associationRepository = new AssociationRepository();
const userRepo = new UtilisateurRepository();
const donsRepo = new DonationRepository();
const JWT_SECRET = 'votre_secret_jwt';

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
    console.log("Params reçus :", req.params);
    console.log("ID reçu :", id);
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

app.get('/associationsByMail/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const association = await associationRepository.findByAdmin(email);
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
    const { nom, description,descriptionCourte,nomImage, localisation, idType } = req.body;
    try {
        const newAssociation = { nom, description,descriptionCourte,nomImage, localisation, idType };
        await associationRepository.create(newAssociation);
        res.status(201).send('Association créée');
    } catch (error) {
        console.error('Erreur lors de la création de l\'association', error);
        res.status(500).send('Erreur serveur');
    }
});

app.delete('/deleteAssociations/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await associationRepository.deleteAsso(Number(id));
        res.status(201).send('Association Supprimée');
    } catch (error) {
        console.error('Erreur lors de la supression de l\'association', error);
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

app.put('/updateAssociation/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom,description,descriptionCourte,idAssociation,nomImage,localisation,idType } = req.body;
    try {
        const updatedAssociation = { nom,description,descriptionCourte,idAssociation,nomImage,localisation,idType };
        console.log(localisation.x);
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
        res.status(400).json({ message: 'Email incorrect.' });
        return;
    }

    // Vérifier le mot de passe
    // @ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid && user.password != password) {
        res.status(400).json({ message: 'Mot de passe incorrect.' });
        return;
    }

    const role = await userRepo.getRole(email);
    console.log(role);
    if (!role) {
        res.status(400).json({ message: 'Rôle incorrect.' });
        return;
    }

    // Générer un token JWT
    // @ts-ignore
    const token = jwt.sign({ id: user.idUtilisateur, email: user.email, role: role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token, user, role });
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

// @ts-ignore
app.post('/changePassword', async (req: Request, res: Response) => {
    const {email, currentPassword, newPassword} = req.body;
    console.log(email, currentPassword, newPassword);
    try {
        const user = await userRepo.findByEmail(email);
        console.log("Utilisateur trouvé :", user);
        if (!user) {
            return res.status(400).json({message: 'Utilisateur non trouvé.'});
        }
        if (!currentPassword) {
            return res.status(400).json({ message: "L'ancien mot de passe est requis." });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Ancien mot de passe incorrect.'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userRepo.updatePassword(email, hashedPassword);

        res.json({message: 'Mot de passe mis à jour avec succès.'});
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe', error);
        res.status(500).json({message: 'Erreur serveur', error});
    }
});

// @ts-ignore
app.post('/changePseudonyme', async (req: Request, res: Response) => {
    const { email, newPseudonyme, password } = req.body;

    try {
        if (!email || !newPseudonyme) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        if (newPseudonyme === user.pseudonyme) {
            return res.status(401).json({ message: "Nouveau pseudonyme identique au pseudonyme actuel." });
        }
        await userRepo.updatePseudonyme(email, newPseudonyme);

        res.json({ message: "Pseudonyme mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors du changement de pseudonyme", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// @ts-ignore
app.post('/deleteAccount', async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        if (!password) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        await userRepo.deleteUseret(user.idUtilisateur);

        res.json({ message: "Compte supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du compte", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
})

app.post('/favorites', async (req: Request, res: Response) => {
    const { idUtilisateur, idAssociation } = req.body;
    try {
        const newAssoFavorite = { idUtilisateur, idAssociation };
        await associationRepository.addFavoriteAsso(newAssoFavorite);
        res.status(201).json({ message: 'Ajouté aux favoris' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout en favori", error });
    }
});

app.delete('/favorites', async (req: Request, res: Response) => {
    const { idUtilisateur, idAssociation } = req.body;

    try {
        const assoFavorite = { idUtilisateur, idAssociation };
        await associationRepository.deleteFavoriteAsso(assoFavorite);
        res.status(201).json({ message: 'Supprimé des favoris' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
});

app.get('/favorites/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const associationsFavorites = await associationRepository.findAllFavorites(Number(id));

        res.status(201).json(associationsFavorites);
    } catch (error) {
        console.error("Erreur lors de la récupération des associations favorites :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// Route pour une donation
app.post('/dons', async (req: Request, res: Response) => {
    let { id, idUser, montant, typeDon, startDate, endDate, frequency } = req.body;
    console.log(id)
    console.log(idUser)
    console.log(montant)
    console.log(typeDon);
    console.log(req.body);
    id = Number(id);
    idUser = Number(idUser);

    await donsRepo.donate(id, idUser, montant, typeDon, startDate, endDate, frequency);
    res.status(201).json({ message: 'Don réalisé avec succès.' });
});
const stripe = require('stripe')('sk_test_51R0Q18IsFroIM4A9oGqJkSFPR8IXesbB9k43TNCGafDJq2nTeWQuGieDiwrdQudTBfjSb55nGboOud4Lq9NrglOg00aVADzSkZ');
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Vérification que l'erreur est bien une instance d'Error
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'Une erreur inconnue est survenue.' });
        }
    }
});

app.get('/getDons', async (req: Request, res: Response) => {
    try {
        const dons = await donsRepo.getAll();
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des dons', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getDonsAdmin/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const dons = await donsRepo.getAssosByAdminAssos(email);
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des dons', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getDonsRecurrent/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const dons = await donsRepo.geDonRecurrentByAssos(email);
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des dons récurrents', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getAssosFavorites/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const dons = await associationRepository.findFavoritesByAssos(email);
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des associations favorites', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getMeilleurDonateur/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const dons = await donsRepo.getMeilleurDonateur(email);
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleurs donateurs', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getMeilleursDonateurs', async (req: Request, res: Response) => {
    try {
        const dons = await donsRepo.getMeilleursDonateurs();
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleurs donateurs', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/getUtilisateurs', async (req: Request, res: Response) => {
    try {
        const dons = await userRepo.getAll();
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        res.status(500).send('Erreur serveur');
    }
});

app.put('/updateUtilisateur/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, pseudonyme } = req.body;
    try {
        const dons = await userRepo.updateUser(email, pseudonyme, Number(id));
        res.json(dons);
    } catch (error) {
        console.error('Erreur lors de l\'update de l\'utilisateur', error);
        res.status(500).send('Erreur serveur');
    }
});

app.delete('/suppUser/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await userRepo.deleteUseret(Number(id));
        res.status(201).json({ message: 'Supprimé des utilisateurs' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
    }
});

app.get("/generate-qrcode/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const url = `https://ton-site.com/detailsAssos?id=${id}`;

    try {
        const qrCode = await QRCode.toDataURL(url);
        res.json({ qrCode });
    } catch (error) {
        res.status(500).send("Erreur lors de la génération du QR Code");
    }
});

app.get("/generate-qrcodes", async (req: Request, res: Response) => {
    try {
        const associations = await associationRepository.findAll();
        const qrCodes = await Promise.all(
            associations.map(async (asso) => {
                const url = `/detailsAssos?id=${asso.idAssociation}`;
                const qrCode = await QRCode.toDataURL(url);
                return { id: asso.idAssociation, name: asso.nom, qrCode };
            })
        );

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(qrCodes, null, 2));

    } catch (error) {
        console.error("Erreur lors de la génération des QR Codes", error);
        res.status(500).send("Erreur serveur");
    }
});

// Lancer le serveur
app.listen(port,'0.0.0.0', () => {
    console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
