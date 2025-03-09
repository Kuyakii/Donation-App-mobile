CREATE TABLE Utilisateur(
                            idUtilisateur INT,
                            pseudonyme VARCHAR(50)  NOT NULL,
                            email VARCHAR(50)  NOT NULL,
                            password VARCHAR(255)  NOT NULL,
                            PRIMARY KEY(idUtilisateur),
                            UNIQUE(email)
);


CREATE TABLE Citoyen(
                        idUtilisateur INT,
                        PRIMARY KEY(idUtilisateur),
                        FOREIGN KEY(idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE Admin_application(
                                  idUtilisateur INT,
                                  PRIMARY KEY(idUtilisateur),
                                  FOREIGN KEY(idUtilisateur) REFERENCES Utilisateur(idUtilisateur)
);

CREATE TABLE TypeAssociation(
                                idType INT,
                                libelleType VARCHAR(50)  NOT NULL,
                                PRIMARY KEY(idType),
                                UNIQUE(libelleType)
);


CREATE TABLE Association(
                            idAssociation INT,
                            nom VARCHAR(100)  NOT NULL,
                            description VARCHAR(1000) ,
                            descriptionCourte VARCHAR(100) NOT NULL,
                            nomImage VARCHAR(50),
                            localisation GEOMETRY,
                            idType INT NOT NULL,
                            PRIMARY KEY(idAssociation),
                            FOREIGN KEY(idType) REFERENCES TypeAssociation(idType)
);


CREATE TABLE Don(
                    idDon INT,
                    montant DOUBLE,
                    dateDon DATE,
                    idAssociation INT NOT NULL,
                    idUtilisateur INT NOT NULL,
                    PRIMARY KEY(idDon),
                    FOREIGN KEY(idAssociation) REFERENCES Association(idAssociation),
                    FOREIGN KEY(idUtilisateur) REFERENCES Citoyen(idUtilisateur)
);


CREATE TABLE Don_Recurrent(
                              idDon INT,
                              date_Debut DATE NOT NULL,
                              date_Fin DATE NOT NULL,
                              frequence VARCHAR(50)  NOT NULL,
                              PRIMARY KEY(idDon),
                              FOREIGN KEY(idDon) REFERENCES Don(idDon)
);

CREATE TABLE Don_Unique(
                           idDon INT,
                           PRIMARY KEY(idDon),
                           FOREIGN KEY(idDon) REFERENCES Don(idDon)
);


CREATE TABLE Admin_association(
                                  idUtilisateur INT,
                                  idAssociation INT NOT NULL,
                                  PRIMARY KEY(idUtilisateur),
                                  FOREIGN KEY(idUtilisateur) REFERENCES Utilisateur(idUtilisateur),
                                  FOREIGN KEY(idAssociation) REFERENCES Association(idAssociation)
);

CREATE TABLE AssociationsFavorites(
                                      idUtilisateur INT,
                                      idAssociation INT,
                                      PRIMARY KEY(idUtilisateur, idAssociation),
                                      FOREIGN KEY(idUtilisateur) REFERENCES Citoyen(idUtilisateur),
                                      FOREIGN KEY(idAssociation) REFERENCES Association(idAssociation)
);

ALTER TABLE Utilisateur MODIFY COLUMN idUtilisateur INT AUTO_INCREMENT;
ALTER TABLE TypeAssociation MODIFY COLUMN idType INT AUTO_INCREMENT;
ALTER TABLE Association MODIFY COLUMN idAssociation INT AUTO_INCREMENT;
ALTER TABLE Don MODIFY COLUMN idDon INT AUTO_INCREMENT;
INSERT INTO Utilisateur(idUtilisateur,pseudonyme,email,password) VALUES (0, 'Admin', 'admin.admin@admin.fr', 'admin');
INSERT into Admin_application(idUtilisateur ) VALUES (0);
INSERT into Citoyen(idUtilisateur ) VALUES (0);

Insert into TypeAssociation (idType, libelleType) VALUES (1, 'Addictions');
INSERT INTO TypeAssociation (idType, libelleType) VALUES (2, 'Handicap');
INSERT INTO TypeAssociation (idType, libelleType)
VALUES
    (3, 'Santé Mentale'),
    (4, 'Maladie chroniques et rares'),
    (5, 'Maladies infectieuses et immunitaires'),
    (6, 'Cancers'),
    (7, 'Droits des patients et prévention santé'),
    (8, 'Familles et aide aux personnes en difficulté'),
    (9, 'Autres thématiques');


INSERT INTO Association (idAssociation, nom, description, descriptionCourte,nomImage, localisation, idType)
VALUES (
           1,
           'Alcool Ecoute Joie et Santé',
           'La Fédération nationale joie et santé (FNJS), anciennement Fédération nationale des amis de la santé – joie et santé, dite Alcool écoute joie et santé est un regroupement reconnu d''utilité publique d''associations d''entraide aux personnes ayant des difficultés avec l''alcool. Les adhérents sont des militants actifs qui sont soit des malades abstinents libérés ayant eu un vécu avec l''alcool, soit des membres de l''entourage qui souhaitent partager à propos de la maladie et accompagner le malade. Alcool écoute joie et santé fait partie des organisations néphalistes1 d''aide aux personnes en difficultés avec l''alcool. Avec certaines spécificités décrites ci-après, Alcool écoute joie et santé propose des groupes de parole à intervalles réguliers. Alcool écoute joie et santé n''est implémentée que dans 16 départements de France métropolitaine.',
           'La Fédération nationale joie et santé (FNJS) aide les personnes en difficulté avec l''alcool.',
           'AEJS.png',
           ST_GeomFromText('POINT(0.06604683207572748 46.65740272882837)'),
           1
       );



INSERT INTO Association (idAssociation, nom, description, descriptionCourte, nomImage, localisation, idType)
VALUES (
           2,
           'ENDO France',
           'ENDO France est une association qui vient en aide aux personnes atteintes d''endométriose, une maladie chronique souvent invalidante. L''association a pour mission d''informer, de soutenir et de défendre les droits des patientes. Elle organise des campagnes de sensibilisation, des groupes de parole et des événements pour faire connaître cette maladie encore méconnue du grand public et des professionnels de santé.',
           'ENDO France soutient les personnes atteintes d''endométriose, une maladie chronique invalidante.',
           'ENDOFRANCE.png',
           ST_GeomFromText('POINT(1.447837801352307 49.092078424822205)'),
           4
       );





INSERT INTO Association (idAssociation, nom, description, descriptionCourte, nomImage, localisation, idType)
VALUES
    (3, 'ASFC – Association française du Syndrome de Fatigue Chronique',
     'L''ASFC est une association engagée dans la reconnaissance, la recherche et le soutien des personnes atteintes du Syndrome de Fatigue Chronique (SFC), une maladie encore méconnue du grand public et des professionnels de santé.
     L''association œuvre à travers des campagnes d''information, des actions de plaidoyer auprès des autorités médicales et politiques, et l''organisation de groupes de soutien pour les patients et leurs proches. Son objectif principal est d''améliorer la prise en charge des malades et de promouvoir une meilleure compréhension du SFC.',
     'Soutien, information et plaidoyer pour les patients atteints du Syndrome de Fatigue Chronique.',
     'ASFC-logo.png',
     ST_GeomFromText('POINT(1.6199267 50.728468)'),
     4),

    (4, 'A.M.I – Association nationale de défense des malades, invalides et handicapés',
     'L''A.M.I est une organisation qui défend activement les droits des personnes malades, invalides et handicapées en France.
     Elle apporte un accompagnement juridique, social et administratif pour aider ces personnes à faire valoir leurs droits, accéder aux soins, et lutter contre les discriminations.
     L''association agit aussi auprès des pouvoirs publics pour améliorer les lois et les politiques en faveur des personnes en situation de handicap ou de maladie invalidante.',
     'Défense des droits et accompagnement des malades, invalides et handicapés.',
     'AMI-logo.png',
     ST_GeomFromText('POINT(4.8100736 46.2900743)')
        , 2),

    (5, 'Fédération Française pour le Don de Sang Bénévole',
     'La Fédération Française pour le Don de Sang Bénévole est une organisation qui regroupe et coordonne les associations engagées dans la collecte de sang en France.
     Elle mène des campagnes de sensibilisation sur l''importance du don du sang, collabore avec les institutions de santé pour garantir un approvisionnement suffisant et sécurisé, et soutient les donneurs à travers des événements et des actions de reconnaissance.
     Son engagement est de sauver des vies grâce à la générosité des donneurs volontaires.',
     'Promotion et organisation du don de sang bénévole en France.',
     'FFDSB-logo.jpg',
     ST_GeomFromText('POINT(2.3720334 48.8607742)'),
     7),

    (6, 'Entraid''addict',
     'Entraid''addict est une association dédiée aux personnes confrontées à des addictions, qu''il s''agisse d''alcool, de drogues, de jeux ou d''autres dépendances.
     L''association propose des groupes de parole, des suivis personnalisés et des ressources pour aider les personnes en difficulté à retrouver une autonomie et une qualité de vie.
     Elle travaille aussi sur la prévention en sensibilisant les jeunes et le grand public aux dangers des addictions.',
     'Soutien et accompagnement des personnes souffrant d''addictions.',
     'ENTRAIDADDICT-logo.png',
     ST_GeomFromText('POINT(2.3499631 48.8763597)'),
     1),

    (7, 'ASBH – Association nationale Spina Bifida et Handicaps associés',
     'L''ASBH est une association qui accompagne les personnes atteintes de Spina Bifida et d''autres handicaps associés.
     Elle met en place des actions pour favoriser l''intégration sociale et professionnelle des personnes concernées, propose un soutien aux familles et milite pour une meilleure prise en charge médicale.
     L''association joue également un rôle important dans la sensibilisation du public et des professionnels de santé sur ces pathologies rares et leurs impacts.',
     'Accompagnement et soutien aux personnes atteintes de Spina Bifida et autres handicaps.',
     'ASBH-logo.jpg',
     ST_GeomFromText('POINT(2.5792707 48.8044837)'),
     2),

    (8, 'RES – Réseau Environnement Santé',
     'Le Réseau Environnement Santé (RES) est une association qui œuvre pour la reconnaissance des liens entre environnement et santé.
     Elle milite pour une réduction des polluants et substances toxiques dans l''air, l''eau et les aliments, afin de prévenir l''apparition de nombreuses maladies chroniques.
     RES intervient auprès des décideurs politiques et des institutions sanitaires pour promouvoir des réglementations plus strictes et informer le grand public sur les dangers environnementaux.',
     'Lutte pour un environnement sain et la prévention des maladies liées aux polluants.',
     'RES-logo.jpg',
     ST_GeomFromText('POINT(2.3687142 48.8817961)'),
     9),

    (9, 'ARSLA – Association pour la Recherche sur la SLA',
     'L''ARSLA est une organisation dédiée à la recherche sur la Sclérose Latérale Amyotrophique (SLA), une maladie neurodégénérative grave aussi appelée maladie de Charcot.
     Elle finance des projets de recherche, soutient les patients et leurs familles, et plaide pour une meilleure reconnaissance et prise en charge de la maladie.
     L''association propose également un accompagnement psychologique et pratique pour améliorer le quotidien des personnes atteintes.',
     'Recherche et soutien aux patients atteints de SLA (maladie de Charcot).',
     'ARSLA-logo.jpg',
     ST_GeomFromText('POINT(2.3928958 48.8422467)'),
     4),

    (10, 'AFS – Association France Spondyloarthrites',
     'L''Association France Spondyloarthrites (AFS) est une structure qui accompagne les patients atteints de spondyloarthrites, un groupe de maladies inflammatoires chroniques affectant les articulations.
     L''association propose des ressources d''information, des conférences médicales, des groupes de soutien et travaille en lien avec les professionnels de santé pour favoriser la recherche et l''amélioration des traitements.
     Elle sensibilise également le grand public sur ces pathologies souvent mal connues.',
     'Soutien et sensibilisation pour les patients atteints de spondyloarthrites.',
     'AFS-logo.jpg',
     ST_GeomFromText('POINT(1.765304 45.251696)'),
     4);

#fait par rosa
#asso addictions

INSERT INTO Association (idAssociation, nom, description, descriptionCourte, nomImage, localisation, idType)
VALUES (
           11,
           'Addictions Alcool Vie Libre',
           'L''Association Addictions Alcool Vie Libre aide les personnes à sortir de l''alcoolisme par la prévention et l''accompagnement avant, pendant et après les soins. Elle agit en milieu scolaire via des séances d''information, soutient les femmes en favorisant l''échange entre elles, et intervient dans le milieu du travail avec des stages et conférences sur l''impact de l''alcool. Elle collabore avec les professionnels médicaux et sociaux pour partager son expérience, sensibilise l''opinion publique par des événements et publications, et mène des actions en milieu carcéral pour aider les détenus concernés.',
           'Prévention et soutien pour les personnes en difficulté avec l''alcool.',
           'addiction_alcool_vie_libre.png',
           ST_GeomFromText('POINT(3.9988931031590482 49.214386979489575)'),
           1
       ),
    (12,
    'Fédération Nationale des Amis de la Santé',
     'La Fédération Nationale des Amis de la Santé regroupe des associations départementales engagées dans l''information, la prévention et la lutte contre les addictions, en particulier l''alcoolisme. Depuis 1978, elle soutient les malades et leur entourage. Inscrite au registre des associations de Schiltigheim, elle représente ses affiliés auprès des institutions publiques et médico-sociales. Son action inclut formation, éducation à la santé et prévention, en partenariat avec d''autres organismes partageant les mêmes objectifs. Elle assure aussi la communication des associations membres via un bulletin trimestriel, un site internet et une manifestation quadriennale.',
    'Prévention et soutien contre l''alcoolisme pour les patients et leur entourage.',
    'fede_amis_de_la_sante.png',
    ST_GeomFromText('POINT(6.868472083259718 49.185214423581755)'),
    1
),
    (13,
     'La Croix Bleue',
     'Association loi 1901, reconnue d''utilité publique depuis 1922 se veut ouverte à TOUS sans distinction pour venir en aide aux personnes en difficulté avec l''alcool et autres addictions ainsi qu''aux personnes de leur entourage.
        Elle est indépendante du corps médical et social, de toute organisation politique, syndicale confessionnelle, tout en entretenant des relations suivies avec les uns et les autres.',
     'Aide et accompagnement pour les personnes en difficulté avec l''alcool et les addictions.',
     'croix_bleue.png',
     ST_GeomFromText('POINT(2.329226866413734 48.8955569353316)'),
     1 )
    ;


#asso handicap

INSERT INTO Association (idAssociation, nom, description, descriptionCourte, nomImage, localisation, idType)
VALUES (
           14,
           'A.D.E.P.A',
        'L''A.D.E.P.A est une association faite pour unir nos forces.Nous avons tous des problèmes plus ou moins importants liés à notre handicap.Nous devons les mettre en commun pour tenter de trouver des solutions.Plus L''A.D.E.P.A aura d’adhérents, plus nous pourrons être entendus par nos interlocuteurs et plus nous pourrons être présents dans sur tout le territoire français auprès des personnes amputées.ADEPA est née à Lyon en 1996. Soucieuse de répondre à une attente légitime, ADEPA développe peu à peu des contacts dans les autres régions',
           'Soutien et représentation des personnes amputées à travers la France.',
           'adepa.png',
           ST_GeomFromText('POINT(4.80457214232564 45.74509778968121)'),
           2
       ),
       (
           15,
           'APAJH',
        'L''APAJH, Association Pour Adultes et Jeunes Handicapés, fait avancer la réflexion et l''action pour assurer à chacun un égal accès aux droits : droit à l''école, droit à la vie professionnelle, droit à la vie sociale et culturelle, droit à une vie intime et affective.
Reconnue d''utilité publique, l''APAJH est le premier organisme en France à considérer et accompagner tous les types de handicap : physiques, intellectuels, sensoriels, psychiques, cognitifs, polyhandicaps, troubles de santé invalidants',
        'Accompagnement et défense des droits des personnes en situation de handicap.',
           'apajh.png',
           ST_GeomFromText('POINT( 2.3217484593296547 48.8426294015467)'),
           2
       ),
       (16,
           'APF France handicap',
        'APF France handicap est la plus importante organisation française, reconnue d''utilité publique, de défense et de représentation des personnes en situation de handicap et de leurs proches. Créée en 1933, connue et reconnue jusqu''en avril 2018 sous le nom d''Association des paralysés de France, APF France handicap rassemble aujourd''hui près de 100 000 acteurs : adhérents, élus, salariés, bénévoles et volontaires, usagers, sans compter ses dizaines de milliers de donateurs et sympathisants.APF France handicap porte des valeurs humanistes, militantes et sociales et un projet d''intérêt général, celui d''une société inclusive et solidaire.L''association agit pour l''égalité des droits, la citoyenneté, la participation sociale et le libre choix du mode de vie des personnes en situation de handicap et de leur famille.',
           'Défense des droits et inclusion des personnes en situation de handicap et de leurs proches.',
           'apf.png',
           ST_GeomFromText('POINT(  2.3535161670250204 48.83038213433824)'),
           2
       ),
       (17,
        'EFAPPE',
        'EFAPPE est la fédération nationale d''associations en faveur des Personnes handicapées par une épilepsie sévère (pharmaco-résistante). Elle rassemble 18 associations pour une meilleure prise en charge globale des personnes handicapées par des épilepsies sévères.
La fédération accompagne ses associations membres pour faire reconnaître et prendre en compte les spécificités des épilepsies.',
        'Soutien et représentation des personnes handicapées par une épilepsie sévère.',
        'efappe.png',
        ST_GeomFromText('POINT(5.675206045664822 45.23770087003999)'),
        2
       ),
       (18,
        'UNAPEI',
        'À l''Unapei, nous sommes 900 000 à nous battre au quotidien pour faire évoluer la société. Familles, amis, personnes handicapées, professionnels, soignants, aidants, bénévoles… Nous sommes tous engagés pour construire une société solidaire et inclusive, respectueuse des différences et du libre arbitre des personnes handicapées intellectuelles, autistes, polyhandicapées et porteuses de handicap psychique.
Avec 550 associations, partout en France, l''Unapei est le principal mouvement associatif français.',
        'Assocation engagée pour une société inclusive des personnes en situation de handicap intellectuel.',
        'unapei.png',
        ST_GeomFromText('POINT(2.3296030026298524 48.89160356644348)'),
        2
       );


#asso santé mentale
INSERT INTO Association (idAssociation, nom, description, descriptionCourte, nomImage, localisation, idType)
VALUES (
           19,
           'Advocacy France',
        'L''association Advocacy France est une association d''usagers en santé mentale , médico-sociale et sociale.
Ses objectifs :
- Promouvoir le concept et les pratiques d''advocacy en France en l''adaptant à la culture et à la situation française.
- Animer un mouvement d''action des usagers de santé mentale (advocacy) en France pour une politique de santé citoyenne.
- Créer des actions d''accès au recours permettant que les opinions des usagers soient prises en compte, leurs demandes justifiées entendues, l''accès à la responsabilité reconnu, la dignité et les droits des usagers en santé mentale respectés, ceci dans les champs médical, juridique et social.
- Aider les patients/usagers à être acteurs sociaux, à prendre la parole, à être entendus et reconnus comme responsables à travers l''élaboration et la réalisation de projets collectifs faisant travailler ensemble usagers, professionnels et bénévoles, en partenariat avec d''autres associations.',
        'Défense des droits et accompagnement des usagers en santé mentale.',
           'advocacy.png',
           ST_GeomFromText('POINT( 2.3931329268772856 48.877482640153744)'),
           3
       ),
       (20,
           'Argos 2001',
        'Association d''aide aux personnes atteintes de troubles bipolaires (maniaco-dépressifs) et à leur entourage, créée en 2001. Ses activités essentielles consistent dans des groupes de paroles pour les patients et leurs proches ainsi que des conférences faites par des psychiatres spécialisés sur les troubles bipolaires.
Environ une soixantaine de bénévoles sont impliqués dans le fonctionnement de l''association, elle compte autour de 1000 adhérents et plus de 4 000 sympathisants.',
        'Soutien, groupes de parole et conférences pour patients et proches.',
           'argos2001.png',
           ST_GeomFromText('POINT(2.403870371951058 48.85710030639953)'),
           3
       ),
       (21,
        'FNAPSY',
        'La Fédération Nationale des Associations d’usagers en Psychiatrie a été créée le 1er mars 1992, sous le sigle FNAP Psy (Fédération Nationale des Associations de (ex) Patients des services Psychiatriques), par trois associations d''usagers, AME (Association pour le Mieux Être), APSA (Association des Psychotiques Stabilisés Autonomes), Revivre Paris, dont le Président était Monsieur Jacques Lombard, notre actuel Président d’Honneur. La fondation de la FNAP PSY a été encouragée et soutenue par Monsieur le Professeur Edouard Zarifian et Monsieur Joël Martinez (alors Directeur du Centre Hospitalier Spécialisé Esquirol 94).
La FNAPSY regroupe à ce jour, 59 associations sur toute la France, soit environ 5000 usagers.Ces associations sont toutes composées en majorité d''usagers en psychiatrie et sont dirigées par des usagers. Une de ces associations adhérentes a une dimension nationale.',
        'Fédération d''associations d’usagers en psychiatrie, créée en 1992, regroupant 59 associations.',
        'fnapsy.png',
        ST_GeomFromText('POINT( 2.3436703762183697 48.82828144086716)'),
        3
       ),
       (22,
        'France Dépression',
        'France Dépression a pour mission de prévenir, d''informer, de soutenir les personnes souffrant de dépression ou de troubles bipolaires, de lutter contre la stigmatisation et de promouvoir leur dignité et le respect de leurs droits au niveau local, national et européen.
L''Association agit au cœur de la cité, au travers de différentes actions, afin d''œuvrer à une meilleure prise en charge des personnes concernées ainsi qu’à une meilleure information sur les causes et les conséquences de la dépression et des troubles bipolaires. A cet effet, France Dépression a pour vocation d’être un espace ressources, physique et virtuel, rassemblant un maximum d''information disponible et adéquate sur les différentes formes de Dépression et favorisant les échanges et le partage d’expériences entre les personnes.',
        'Prévention, soutien et information sur la dépression et les troubles bipolaires.',
        'france_dep.png',
        ST_GeomFromText('POINT(6.1806669303434205 48.66705812262046)'),
        3
       ),
       (23,
        'SCHIZO-OUI',
        'Schizo-oui est une association d''usagers en santé mentale née en janvier 1998. A cette époque, seulement un schizophrène sur cinq avait connaissance de son diagnostic. Or, cette maladie touche 1% de la population toutes catégories sociales confondues. Il est nécessaire de s''unir pour la combattre en ayant des objectifs précis. C''est la volonté de Schizo-oui, association qui s’organise. Schizo-oui est une association apolitique et indépendante de tout groupe de pression.',
        'Association créée pour informer, soutenir et lutter contre la schizophrénie.',
        'schizo-oui.png',
        ST_GeomFromText('POINT(2.344837103996241 48.82565199570769)'),
        3
       ),
       (24,
        'UNAFAM',
        'L''Unafam est une association reconnue d''utilité publique, qui accueille, écoute, soutient, forme, informe et accompagne les familles et l''entourage de personnes vivant avec des troubles psychiques depuis 1963. Elle compte plus de 14 000 adhérents.
Depuis sa création l''Unafam concentre son action au profit de l''entourage des personnes vivant avec des troubles psychiques sévères, essentiellement des personnes atteintes de schizophrénie, de troubles bipolaires, de dépressions sévères, de psychoses graves et de troubles obsessionnels compulsifs. Depuis plus récemment, l''Unafam reçoit les parents d’enfants et d''adolescents ayant des troubles psychologiques, des troubles psychiques ou des troubles du comportement.',
        'Soutien aux familles de personnes vivant avec des troubles psychiques depuis 1963.',
        'unafam.png',
        ST_GeomFromText('POINT(2.324297000000513 48.891858108347634)'),
        3
       );
