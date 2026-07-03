import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { parse, stringify } from "yaml";

const rootDir = path.resolve(".");

const titleMap = new Map(Object.entries({
  "AI Agent": "Agent d'IA",
  "AI Agents vs AI Workflows": "Agents d'IA et workflows d'IA",
  "AI Search, Structured Content and Knowledge Graph SEO": "Recherche IA, contenu structuré et SEO par graphe de connaissances",
  "Algorithmic Composition": "Composition algorithmique",
  "Algorithmic Composition and Rule-Based Music": "Composition algorithmique et musique fondee sur des regles",
  "Augmented Intelligence": "Intelligence augmentee",
  "Autonomous System": "Systeme autonome",
  "C2PA Content Credentials and Generative Media Provenance": "C2PA, Content Credentials et provenance des medias generatifs",
  "Contextual Execution": "Execution contextuelle",
  "Contextual Execution and Graph Runtimes": "Execution contextuelle et runtimes de graphe",
  "Creative Coding": "Programmation creative",
  "Creative Coding Pedagogy from Logo to p5.js": "Pedagogie de la programmation creative, de Logo a p5.js",
  "Cybernetic Feedback": "Retroaction cybernetique",
  "Digital Preservation": "Preservation numerique",
  "Digital Preservation and Living Archives": "Preservation numerique et archives vivantes",
  "Domain Operating System": "Systeme d'exploitation de domaine",
  "Entity Identity": "Identite d'entite",
  "Event-Driven Architecture": "Architecture evenementielle",
  "Event-Driven Architecture and Event Streams": "Architecture evenementielle et flux d'evenements",
  "Foundational Lineage 001": "Lignee fondatrice 001",
  "Generative AI": "IA generative",
  "Generative AI, Latent Space and Creative Workflows": "IA generative, espace latent et workflows creatifs",
  "Generative System": "Systeme generatif",
  "Generative Systems, Cybernetics and Creative Coding": "Systemes generatifs, cybernetique et programmation creative",
  "Graph Modeling": "Modelisation de graphe",
  "Graph Runtime": "Runtime de graphe",
  "How Large Language Models Actually Work": "Comment fonctionnent vraiment les grands modèles de langage",
  "Human-Computer Interaction": "Interaction humain-machine",
  "Human-Computer Interaction for Creative Tools": "Interaction humain-machine pour les outils creatifs",
  "Human Computer Interaction for Creative Tools": "Interaction humain-machine pour les outils creatifs",
  "Hypertext": "Hypertexte",
  "Hypertext and Augmented Knowledge Systems": "Hypertexte et systèmes de connaissance augmentée",
  "IIIF and Compound Cultural Objects": "IIIF et objets culturels composes",
  "Internet Culture": "Culture Internet",
  "Knowledge Graph": "Graphe de connaissances",
  "Knowledge Graph SEO": "SEO par graphe de connaissances",
  "Knowledge Graphs for Cultural Infrastructure": "Graphes de connaissances pour les infrastructures culturelles",
  "Knowledge Hub Foundations": "Fondations du hub de connaissance",
  "Knowledge Hub Fourth Wave": "Hub de connaissance, quatrième vague",
  "Knowledge Hub Second Wave": "Hub de connaissance, deuxième vague",
  "Knowledge Hub Third Wave": "Hub de connaissance, troisième vague",
  "Large Language Model": "Grand modele de langage",
  "Linked Data": "Donnees liees",
  "Linked Data and Public Knowledge Pages": "Donnees liees et pages publiques de connaissance",
  "Local and Open Source AI Systems": "Systèmes d’IA locaux et open source",
  "Metadata": "Metadonnees",
  "Metadata, Cataloguing and Cultural Memory": "Metadonnees, catalogage et memoire culturelle",
  "Microservice Architecture": "Architecture de microservices",
  "Microservices, Modular Monoliths and System Boundaries": "Microservices, monolithes modulaires et frontieres de systeme",
  "Model Context Protocol and Tool-Using AI Systems": "Model Context Protocol et systemes d'IA utilisant des outils",
  "Motion Design": "Motion design",
  "Motion Design, Time and Interface Semantics": "Motion design, temps et semantique d'interface",
  "Multimodal AI": "IA multimodale",
  "Multimodal AI Across Text, Image, Audio and Video": "IA multimodale pour le texte, l'image, l'audio et la video",
  "Observability for AI Agents and Tool-Calling Systems": "Observabilite des agents d'IA et des systemes d'appel d'outils",
  "Ontologies, Taxonomies and Knowledge Modeling": "Ontologies, taxonomies et modelisation des connaissances",
  "Ontology": "Ontologie",
  "Open Source": "Open source",
  "Open Source as Cultural Infrastructure": "L’open source comme infrastructure culturelle",
  "Open Weight Model": "Modèle à poids ouverts",
  "Open Weights": "Poids ouverts",
  "Local AI": "IA locale",
  "Browser AI": "IA dans le navigateur",
  "AI Search": "Recherche IA",
  "AI Governance": "Gouvernance de l'IA",
  "AI Protocols": "Protocoles d'IA",
  "AI Workflows": "Workflows d'IA",
  "Creative Technology": "Technologies créatives",
  "Cultural Infrastructure": "Infrastructure culturelle",
  "Knowledge Hub": "Hub de connaissance",
  "Editorial Collection": "Collection éditoriale",
  "Research Library": "Bibliothèque de recherche",
  "Semantic Publishing": "Publication sémantique",
  "Systems Architecture": "Architecture des systèmes",
  "Graph Computing": "Calcul sur graphe",
  "Programming": "Programmation",
  "Web Development": "Développement web",
  "Interface Design": "Conception d'interface",
  "Visual Culture": "Culture visuelle",
  "Digital Art": "Art numérique",
  "Audio Engineering": "Ingénierie audio",
  "Machine Learning": "Apprentissage automatique",
  "Web Machine Learning": "Apprentissage automatique Web",
  "Model Licensing": "Licence de modèle",
  "Quantization": "Quantification",
  "Digital Independence": "Indépendance numérique",
  "Runtime Engine": "Moteur d'exécution",
  "Domain OS": "Système d'exploitation de domaine",
  "Business OS": "Système d'exploitation métier",
  "Composable Systems": "Systèmes composables",
  "Knowledge Systems": "Systèmes de connaissance",
  "Structured Data": "Données structurées",
  "Entity SEO": "SEO d'entité",
  "Third Wave": "Troisième vague",
  "Fourth Wave": "Quatrième vague",
  "Second Wave": "Deuxième vague",
  "Foundations": "Fondations",
  "Software": "Logiciel",
  "Commons": "Communs",
  "Design Technology": "Technologies de design",
  "Infrastructure": "Infrastructure",
  "Digital Art": "Art numérique",
  "Open Source AI": "IA open source",
  "Ethical Principles for Web Machine Learning": "Principes éthiques pour l'apprentissage automatique Web",
  "Inference": "Inférence",
  "Language Models": "Modèles de langage",
  "Open Source": "open source",
  "Open Source Initiative": "Open Source Initiative",
  "Personal Knowledge System": "Système personnel de connaissance",
  "Personal Knowledge Systems and Digital Gardens": "Systèmes personnels de connaissance et jardins numériques",
  "Procedural Graphics": "Graphisme procédural",
  "Procedural Graphics, Shaders and Visual Systems": "Graphisme procédural, shaders et systèmes visuels",
  "Prompt Injection and Trust Boundaries in AI Knowledge Systems": "Injection de prompt et frontières de confiance dans les systèmes de connaissance IA",
  "Provenance": "Provenance",
  "Redis Streams for Orchestration": "Redis Streams pour l’orchestration",
  "Responsible AI Governance for Creative and Cultural Systems": "Gouvernance responsable de l'IA pour les systèmes créatifs et culturels",
  "Retrieval-Augmented Generation": "Génération augmentée par récupération",
  "Retrieval-Augmented Generation and Knowledge Systems": "Génération augmentée par récupération et systèmes de connaissance",
  "Runtime Engines and Domain Operating Systems": "Moteurs d'exécution et systèmes d'exploitation de domaine",
  "Runtime Theory": "Théorie du runtime",
  "Signal Archaeology": "Archéologie du signal",
  "Signal Archaeology, Audio Memory and Machine Listening": "Archéologie du signal, mémoire audio et écoute machine",
  "Systems Thinking": "Pensée systémique",
  "Systems Thinking for Creative Practice": "Pensée systémique pour la pratique créative",
  "Typography": "Typographie",
  "Typography, Reading Systems and Digital Interfaces": "Typographie, systèmes de lecture et interfaces numériques",
  "Verifiable Credentials for Cultural Archives and Creator Identity": "Identifiants vérifiables pour les archives culturelles et l’identité des créateurs",
  "Web Audio": "Audio web",
  "Web Audio and Browser-Based Sound Systems": "Web Audio et systèmes sonores dans le navigateur",
  "Web Audio API": "Web Audio API",
  "WebNN and Local AI in the Browser": "WebNN et IA locale dans le navigateur",
  "Why Graphs Are More Powerful Than Folders": "Pourquoi les graphes sont plus puissants que les dossiers",
  "Electronic Artefacts Lightweight Template": "Electronic Artefacts Lightweight Template",
}));

const topicMap = new Map(Object.entries({
  "ai-agent": "les agents logiciels capables d'observer un contexte, de choisir une action et de mobiliser des outils avec une autonomie encadree",
  "autonomous-system": "les systemes capables de poursuivre un objectif sans intervention permanente, avec des limites de controle explicites",
  "augmented-intelligence": "les outils qui etendent la perception, la memoire et le raisonnement humains sans remplacer le jugement humain",
  "creative-coding": "l'usage du code comme medium artistique, exploratoire ou pedagogique",
  "cybernetic-feedback": "les boucles de retroaction qui relient mesure, action, correction et comportement systemique",
  "digital-preservation": "la conservation active des objets numeriques, de leurs formats, de leurs droits et de leurs contextes d'interpretation",
  "event-driven-architecture": "les architectures ou les changements d'etat sont publies sous forme d'evenements et consommes par des composants decouples",
  "generative-ai": "les systemes d'IA capables de produire ou transformer du texte, des images, du son, de la video, du code ou des donnees structurees",
  "generative-system": "les systemes qui produisent des formes a partir de regles, de contraintes et de boucles de selection",
  "graph-modeling": "la modelisation d'entites et de relations sous forme de graphe exploitable",
  "graph-runtime": "les environnements d'execution ou les entites, relations, permissions et evenements du graphe participent directement au calcul",
  "human-computer-interaction": "la conception des interactions entre personnes, interfaces, outils et environnements informatiques",
  "hypertext": "les structures de lecture et d'ecriture fondees sur des liens, des parcours et des references croisables",
  "internet-culture": "les formes culturelles, communautaires et techniques qui emergent des reseaux numeriques",
  "knowledge-graph": "les graphes de connaissances qui structurent des entites, des relations, des sources et des preuves",
  "large-language-model": "les grands modeles de langage entraines a predire et generer des sequences de tokens a partir de corpus massifs",
  "linked-data": "les donnees publiees avec des identifiants et des relations exploitables par le Web semantique",
  "metadata": "les metadonnees qui rendent des contenus decrits, recherchables, citables et reliables",
  "microservice-architecture": "les architectures de services separes par domaine, contrat et responsabilite operationnelle",
  "motion-design": "le mouvement comme langage d'interface, de rythme, d'attention et de transition",
  "multimodal-ai": "les systemes d'IA capables de traiter plusieurs modalites comme le texte, l'image, l'audio ou la video",
  "ontology": "les modeles conceptuels qui definissent classes, proprietes, relations et contraintes d'un domaine",
  "open-source": "les pratiques de publication, maintenance et cooperation fondees sur du code et des ressources ouverts",
  "open-weight-model": "les modeles dont les poids sont publies pour permettre l'execution, l'audit ou l'adaptation locale",
  "personal-knowledge-system": "les systemes personnels d'organisation de notes, sources, idees et connexions",
  "procedural-graphics": "les images et formes visuelles generees par algorithmes, shaders ou regles parametriques",
  "provenance": "les informations qui documentent l'origine, les transformations, les decisions et la chaine de responsabilite d'un objet",
  "retrieval-augmented-generation": "les architectures qui recuperent des sources externes avant ou pendant la generation d'une reponse par IA",
  "signal-archaeology": "l'analyse des traces sonores, mediatiques et techniques pour rendre lisibles des memoires enfouies",
  "systems-thinking": "la lecture des situations par relations, limites, boucles, flux, delais et points de levier",
  "typography": "la composition du texte par caracteres, espacements, hierarchie, rythme et conditions de lecture",
  "web-audio": "les API audio du navigateur et les systemes sonores interactifs produits sur le Web",
}));

const tagMap = new Map(Object.entries({
  "ai": "IA",
  "AI Agents": "agents d'IA",
  "AI Tools": "outils d'IA",
  "Artificial Intelligence": "intelligence artificielle",
  "Accessibility": "accessibilite",
  "agents": "agents",
  "architecture": "architecture",
  "archive": "archive",
  "archives": "archives",
  "audio": "audio",
  "browser": "navigateur",
  "cataloguing": "catalogage",
  "Context Protocol": "protocole de contexte",
  "creative-coding": "programmation creative",
  "Creative Coding": "programmation creative",
  "Creative Tools": "outils creatifs",
  "Creative Technology": "technologies créatives",
  "culture": "culture",
  "cybernetics": "cybernetique",
  "data": "donnees",
  "design": "design",
  "Design Technology": "technologies de design",
  "federation": "federation",
  "graph": "graphe",
  "Graph Computing": "calcul sur graphe",
  "hci": "interaction humain-machine",
  "HCI": "interaction humain-machine",
  "Human Computer Interaction": "interaction humain-machine",
  "Human Oversight": "supervision humaine",
  "Archives": "archives",
  "Knowledge Hub": "hub de connaissance",
  "Knowledge Systems": "systèmes de connaissance",
  "knowledge-graph": "graphe de connaissances",
  "Knowledge Graph": "graphe de connaissances",
  "Knowledge Graph SEO": "SEO par graphe de connaissances",
  "Editorial Collection": "collection éditoriale",
  "Research Library": "bibliothèque de recherche",
  "Systems Architecture": "architecture des systèmes",
  "linked-data": "donnees liees",
  "metadata": "metadonnees",
  "multimodal": "multimodal",
  "open-source": "open source",
  "Open Source": "open source",
  "Open Weights": "poids ouverts",
  "Open Source AI": "IA open source",
  "Browser AI": "IA dans le navigateur",
  "Web Machine Learning": "apprentissage automatique Web",
  "Local AI": "IA locale",
  "Local Inference": "inférence locale",
  "AI Search": "recherche IA",
  "AI Governance": "gouvernance de l'IA",
  "AI Protocols": "protocoles d'IA",
  "AI Workflows": "workflows d'IA",
  "provenance": "provenance",
  "Personal Knowledge Management": "gestion personnelle des connaissances",
  "Research Methods": "méthodes de recherche",
  "Network Culture": "culture des réseaux",
  "Memes": "mèmes",
  "History of Technology": "histoire des technologies",
  "Backlinks": "liens entrants",
  "Software architecture": "architecture logicielle",
  "Model Licensing": "licence de modèle",
  "Quantization": "quantification",
  "Digital Independence": "indépendance numérique",
  "runtime": "runtime",
  "Runtime Engine": "moteur d'exécution",
  "Domain OS": "système d'exploitation de domaine",
  "Business OS": "système d'exploitation métier",
  "Composable Systems": "systèmes composables",
  "semantic-web": "Web semantique",
  "systems": "systemes",
  "Systems Design": "conception de systemes",
  "Software Architecture": "architecture logicielle",
  "Tool Use": "usage d'outils",
  "Augmented Intelligence": "intelligence augmentee",
  "Automation": "automatisation",
  "Orchestration": "orchestration",
  "Design": "design",
  "typography": "typographie",
  "web": "Web",
  "Web Development": "développement web",
  "Programming": "programmation",
  "Interface Design": "conception d'interface",
  "Visual Culture": "culture visuelle",
  "Digital Art": "art numérique",
  "Audio Engineering": "ingénierie audio",
  "Machine Learning": "apprentissage automatique",
  "Inference": "inférence",
  "Language Models": "modèles de langage",
  "Software": "logiciel",
  "Commons": "communs",
  "Creative Business": "activité créative",
  "Cultural Infrastructure": "infrastructure culturelle",
  "Infrastructure": "infrastructure",
  "Internet Culture": "culture Internet",
  "Third Wave": "troisième vague",
  "Fourth Wave": "quatrième vague",
  "Second Wave": "deuxième vague",
  "Foundations": "fondations",
}));

const accentFrenchText = (value) => value
  .replace(/\bEtude\b/g, "Étude")
  .replace(/\betendent\b/g, "étendent")
  .replace(/\betendre\b/g, "étendre")
  .replace(/\bcontrole\b/g, "contrôle")
  .replace(/\bregles\b/g, "règles")
  .replace(/\bparametriques\b/g, "paramétriques")
  .replace(/\bgenerees\b/g, "générées")
  .replace(/\bpublies\b/g, "publiés")
  .replace(/\bexecution\b/g, "exécution")
  .replace(/\bou\b/g, "où")
  .replace(/\bmemoire\b/g, "mémoire")
  .replace(/\bmedium\b/g, "médium")
  .replace(/\bpedagogique\b/g, "pédagogique")
  .replace(/\bretroaction\b/g, "rétroaction")
  .replace(/\bsystemique\b/g, "systémique")
  .replace(/\bnumeriques\b/g, "numériques")
  .replace(/\binterpretation\b/g, "interprétation")
  .replace(/\betat\b/g, "état")
  .replace(/\bevenements\b/g, "événements")
  .replace(/\bconsommes\b/g, "consommés")
  .replace(/\bdecouples\b/g, "découplés")
  .replace(/\bvideo\b/g, "vidéo")
  .replace(/\bdonnees\b/g, "données")
  .replace(/\bstructurees\b/g, "structurées")
  .replace(/\bmodelisation\b/g, "modélisation")
  .replace(/\bModelisation\b/g, "Modélisation")
  .replace(/\bentites\b/g, "entités")
  .replace(/\bentite\b/g, "entité")
  .replace(/\bcybernetique\b/g, "cybernétique")
  .replace(/\bentraines\b/g, "entraînés")
  .replace(/\bpredire\b/g, "prédire")
  .replace(/\bgenerer\b/g, "générer")
  .replace(/\bsequences\b/g, "séquences")
  .replace(/\bmetadonnees\b/g, "métadonnées")
  .replace(/\bdecrits\b/g, "décrits")
  .replace(/\bsepares\b/g, "séparés")
  .replace(/\bfrontieres\b/g, "frontières")
  .replace(/\bresponsabilite\b/g, "responsabilité")
  .replace(/\bsemantique\b/g, "sémantique")
  .replace(/\bmodalites\b/g, "modalités")
  .replace(/\bproprietes\b/g, "propriétés")
  .replace(/\breseaux\b/g, "réseaux")
  .replace(/\bemergent\b/g, "émergent")
  .replace(/\bidees\b/g, "idées")
  .replace(/\bdecisions\b/g, "décisions")
  .replace(/\bchaine\b/g, "chaîne")
  .replace(/\brecuperent\b/g, "récupèrent")
  .replace(/\bgeneration\b/g, "génération")
  .replace(/\breponse\b/g, "réponse")
  .replace(/\bhypotheses\b/g, "hypothèses")
  .replace(/\bpartagees\b/g, "partagées")
  .replace(/\bexperimentations\b/g, "expérimentations")
  .replace(/\bverification\b/g, "vérification")
  .replace(/\bcriteres\b/g, "critères")
  .replace(/\bfondee\b/g, "fondée")
  .replace(/\bcomposes\b/g, "composés")
  .replace(/\bmedias\b/g, "médias")
  .replace(/\bgeneratifs\b/g, "génératifs")
  .replace(/\baugmentee\b/g, "augmentée")
  .replace(/\bcreatifs\b/g, "créatifs")
  .replace(/\bSynthese\b/g, "Synthèse")
  .replace(/\bRole\b/g, "Rôle")
  .replace(/\bReferences\b/g, "Références")
  .replace(/\bPensee\b/g, "Pensée")
  .replace(/\bPedagogie\b/g, "Pédagogie")
  .replace(/\bSysteme\b/g, "Système")
  .replace(/\bSystemes\b/g, "Systèmes")
  .replace(/\bTheorie\b/g, "Théorie")
  .replace(/\bExecution\b/g, "Exécution")
  .replace(/\bDonnees\b/g, "Données")
  .replace(/\bMetadonnees\b/g, "Métadonnées")
  .replace(/\bPreservation\b/g, "Préservation")
  .replace(/\bGeneration\b/g, "Génération")
  .replace(/\bArcheologie\b/g, "Archéologie")
  .replace(/\bLignee\b/g, "Lignée")
  .replace(/\bIdentite\b/g, "Identité")
  .replace(/\bModele\b/g, "Modèle")
  .replace(/\bModeles\b/g, "Modèles")
  .replace(/\bRetroaction\b/g, "Rétroaction")
  .replace(/\bGouvernance\b/g, "Gouvernance")
  .replace(/\bObservabilite\b/g, "Observabilité")
  .replace(/\bProgrammation creative\b/g, "Programmation créative")
  .replace(/\bprogrammation creative\b/g, "programmation créative")
  .replace(/\bpratique creative\b/g, "pratique créative")
  .replace(/\boutils creatifs\b/g, "outils créatifs")
  .replace(/\bSystemes generatifs\b/g, "Systèmes génératifs")
  .replace(/\bsystemes generatifs\b/g, "systèmes génératifs")
  .replace(/\bmedias generatifs\b/g, "médias génératifs")
  .replace(/\bIA generative\b/g, "IA générative")
  .replace(/\bidentite\b/g, "identité")
  .replace(/\bmodele\b/g, "modèle")
  .replace(/\bmodeles\b/g, "modèles")
  .replace(/\bcontextualisee\b/g, "contextualisée")
  .replace(/\bcontextualisees\b/g, "contextualisées")
  .replace(/\beditoriale\b/g, "éditoriale")
  .replace(/\beditoriales\b/g, "éditoriales")
  .replace(/\bprobleme\b/g, "problème")
  .replace(/\blisibilite\b/g, "lisibilité")
  .replace(/\btraite\b/g, "traité")
  .replace(/\btraitee\b/g, "traitée")
  .replace(/\bconservees\b/g, "conservées")
  .replace(/\brattachees\b/g, "rattachées")
  .replace(/\bprivilegie\b/g, "privilégie")
  .replace(/\bheritees\b/g, "héritées")
  .replace(/\bmelanger\b/g, "mélanger")
  .replace(/\bcriteres\b/g, "critères")
  .replace(/\bconcretes\b/g, "concrètes")
  .replace(/\bmeme\b/g, "même")
  .replace(/\bproximite\b/g, "proximité")
  .replace(/\butilite\b/g, "utilité")
  .replace(/\bdecrit\b/g, "décrit")
  .replace(/\bmethodes\b/g, "méthodes")
  .replace(/\bevoluer\b/g, "évoluer")
  .replace(/\betre\b/g, "être")
  .replace(/\btestees\b/g, "testées")
  .replace(/\bassocies\b/g, "associés")
  .replace(/\bsitue\b/g, "situe")
  .replace(/\bsynthese\b/g, "synthèse")
  .replace(/\bentree\b/g, "entrée")
  .replace(/\brepere\b/g, "repère")
  .replace(/\bencadree\b/g, "encadrée")
  .replace(/\bdocumente\b/g, "documenté")
  .replace(/\babordee\b/g, "abordée")
  .replace(/\bassociéees\b/g, "associées")
  .replace(/\bassociéee\b/g, "associée")
  .replace(/\bassociees\b/g, "associées")
  .replace(/\bassociee\b/g, "associée")
  .replace(/\bdeconnectes\b/g, "déconnectés")
  .replace(/\breliee\b/g, "reliée")
  .replace(/\breliees\b/g, "reliées")
  .replace(/\bverifiable\b/g, "vérifiable")
  .replace(/\bcles\b/g, "clés")
  .replace(/\brole\b/g, "rôle")
  .replace(/\bpresente\b/g, "présenté")
  .replace(/\bpresentee\b/g, "présentée")
  .replace(/\bdocumentes\b/g, "documentés")
  .replace(/\bconsequences\b/g, "conséquences")
  .replace(/\bdecrits\b/g, "décrits")
  .replace(/\bdecrites\b/g, "décrites")
  .replace(/\bimplementation\b/g, "implémentation")
  .replace(/\becosysteme\b/g, "écosystème")
  .replace(/\bcontexte\b/g, "contexte")
  .replace(/\baccessibilite\b/g, "accessibilité")
  .replace(/\baugmentee\b/g, "augmentée")
  .replaceAll(" francais", " français")
  .replaceAll(" francaise", " française")
  .replaceAll(" francaises", " françaises")
  .replaceAll(" francophone", " francophone")
  .replaceAll(" designe", " désigne")
  .replaceAll(" defini", " défini")
  .replaceAll(" definit", " définit")
  .replaceAll(" definition", " définition")
  .replaceAll(" definitions", " définitions")
  .replaceAll(" reference", " référence")
  .replaceAll(" references", " références")
  .replaceAll(" associe", " associé")
  .replaceAll(" associees", " associées")
  .replaceAll(" numerique", " numérique")
  .replaceAll(" numeriques", " numériques")
  .replaceAll(" systeme", " système")
  .replaceAll(" systemes", " systèmes")
  .replaceAll(" Systeme", " Système")
  .replaceAll(" Systemes", " Systèmes")
  .replaceAll(" evenement", " événement")
  .replaceAll(" evenements", " événements")
  .replaceAll(" evenementielle", " événementielle")
  .replaceAll(" generatif", " génératif")
  .replaceAll(" generatifs", " génératifs")
  .replaceAll(" generative", " générative")
  .replaceAll(" generatives", " génératives")
  .replaceAll(" creatif", " créatif")
  .replaceAll(" creatifs", " créatifs")
  .replaceAll(" creative", " créative")
  .replaceAll(" creatives", " créatives")
  .replaceAll(" entite", " entité")
  .replaceAll(" entites", " entités")
  .replaceAll(" identite", " identité")
  .replaceAll(" medi", " médi")
  .replaceAll(" donnees", " données")
  .replaceAll(" liees", " liées")
  .replaceAll(" metadonnees", " métadonnées")
  .replaceAll(" memoire", " mémoire")
  .replaceAll(" semantique", " sémantique")
  .replaceAll(" verifiable", " vérifiable")
  .replaceAll(" verifiables", " vérifiables")
  .replaceAll(" utilise", " utilisé")
  .replaceAll(" utilisable", " utilisable")
  .replaceAll(" operationnelle", " opérationnelle")
  .replaceAll(" operationnel", " opérationnel")
  .replaceAll(" perimetre", " périmètre")
  .replaceAll(" Perimetre", " Périmètre")
  .replaceAll(" selection", " sélection")
  .replaceAll(" coherence", " cohérence")
  .replaceAll(" hypotheses", " hypothèses")
  .replaceAll(" experience", " expérience")
  .replaceAll(" experiences", " expériences")
  .replaceAll(" fonctionnalite", " fonctionnalité")
  .replaceAll(" fonctionnalites", " fonctionnalités")
  .replaceAll(" personnalisee", " personnalisée")
  .replaceAll(" evalue", " évalue")
  .replaceAll(" evaluer", " évaluer")
  .replaceAll(" ecosysteme", " écosystème")
  .replaceAll(" public d'Electronic", " public d'Electronic")
  .replaceAll(" a ", " à ")
  .replaceAll(" A ", " À ");

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const normalizeTypes = new Set(["concept", "technology", "publication", "collection", "researchField"]);
const publicationHeadings = {
  conceptPage: ["Définition", "Périmètre", "Applications", "Limites", "Références"],
  methodPage: ["Objectif", "Entrées", "Procédure", "Résultats", "Limites", "Exemples"],
  researchNote: ["Question", "Contexte", "Observation", "Interprétation", "Limites", "Références"],
  technicalArticle: ["Problème", "Architecture", "Mise en œuvre", "Éléments de preuve", "Limites", "Références"],
  essay: ["Résumé", "Thèse", "Argument", "Conclusion", "Références"],
  caseStudy: ["Contexte", "Contraintes", "Approche", "Mise en œuvre", "Résultat", "Éléments de preuve"],
  documentation: ["Périmètre", "Frontière du système", "Usage", "Version", "Historique des modifications"],
  archiveRecord: ["Description", "Provenance", "Contexte", "Importance", "Droits"],
  experimentalPublication: ["Contexte", "Œuvre", "Artefacts constitutifs", "Crédits", "Droits"],
};

const splitMarkdown = (source, file) => {
  const match = frontmatterPattern.exec(source);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  return {
    data: parse(match[1] || "") || {},
    body: source.slice(match[0].length).trim(),
  };
};

const baseSlug = (entity) => entity.slug?.canonical || entity.translationOf?.split(":").at(-1) || entity.id.split(":").at(-1);
const titleFor = (english, french) => titleMap.get(english?.title) || french.title || english?.title || baseSlug(french);
const topicFor = (english, title) => topicMap.get(baseSlug(english || {})) || `le sujet "${title}" dans le graphe public d'Electronic Artefacts`;
const listSentence = (items, fallback) => {
  const clean = (items || []).map((item) => tagMap.get(item) || item).filter(Boolean).slice(0, 5);
  return clean.length ? clean.join(", ") : fallback;
};

const refTitle = (label) => titleMap.get(label) || label;
const localizeRefs = (value) => {
  if (Array.isArray(value)) return value.map(localizeRefs);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key,
      key === "label" && typeof child === "string" ? refTitle(child) : localizeRefs(child),
    ]));
  }
  return value;
};

const sourceLine = (entity) => {
  if (!entity.sources?.length) return accentFrenchText("Les sources associees sont conservees dans la fiche canonique du graphe.");
  return accentFrenchText("Les sources principales restent disponibles dans le bloc de references de la fiche.");
};

const genericAbstract = (type, title, topic) => {
  if (type === "publication") {
    return accentFrenchText(`${title} examine ${topic}. La fiche en synthétise les architectures, les usages, les limites et les sources de référence.`);
  }
  if (type === "collection") {
    return accentFrenchText(`${title} rassemble des fiches liées par un même axe éditorial, afin de donner une progression lisible aux archives de connaissance d'Electronic Artefacts.`);
  }
  if (type === "technology") {
    return accentFrenchText(`${title} est documenté pour son rôle dans les systèmes d'Electronic Artefacts, ses usages, ses limites et les technologies qui lui sont liées.`);
  }
  if (type === "researchField") {
    return accentFrenchText(`${title} cadre un champ de recherche suivi par Electronic Artefacts, en reliant questions ouvertes, prototypes, sources et hypotheses de travail.`);
  }
  return accentFrenchText(`${title} désigne ${topic}. La fiche en précise l'usage, les limites et les relations avec les projets, technologies et publications d'Electronic Artefacts.`);
};

const bodyFor = (entity, english, title, topic) => {
  const references = sourceLine(english || entity);
  if (entity.type === "publication") {
    const headings = publicationHeadings[entity.format] || publicationHeadings.technicalArticle;
    const sections = [
      `${title} examine ${topic}. La fiche donne une entrée française stable, utilisable pour lire le sujet et relier ses sources au reste du graphe.`,
      "Le sujet est abordé par ses relations avec les concepts, projets et technologies concernés, afin de rendre son contexte de conception lisible.",
      "La page décrit les usages, contraintes et choix de structure qui permettent d'appliquer le sujet dans des situations concrètes.",
      "Les sources, relations et éléments de contexte restent attachés à la fiche pour distinguer synthèse éditoriale, preuves et références.",
      "Les limites sont formulées par rapport au périmètre de la fiche, aux sources disponibles et aux conditions d'usage documentées.",
      references,
    ];
    return headings.map((heading, index) => `## ${heading}\n\n${sections[index] || sections.at(-1)}\n`).join("\n");
  }
  if (entity.type === "collection") {
    return accentFrenchText(`## Intention\n\n${title} rassemble des fiches liées par un même axe éditorial.\n\n## Sélection\n\nLa collection organise les contenus par proximité éditoriale, par utilité de navigation et par potentiel de liens internes. Elle permet de parcourir le hub de connaissance sans perdre la cohérence du sujet.\n\n## Usage\n\nCette entrée sert de repère pour explorer plusieurs publications ou notions depuis une même page française.\n\n## Références\n\n${references}\n`);
  }
  if (entity.type === "researchField") {
    return accentFrenchText(`## Champ\n\n${title} decrit un espace de recherche actif pour Electronic Artefacts. Il relie ${topic} a des questions, prototypes et methodes qui peuvent evoluer dans le temps.\n\n## Questions\n\n- Comment rendre les hypotheses suffisamment explicites pour etre partagees, testees et reliees au graphe ?\n- Quelles preuves, interfaces ou architectures permettent de transformer ce champ en experience utilisable ?\n\n## Usage\n\nCette fiche donne une entree francaise au champ de recherche et conserve ses liens avec les projets, publications et technologies associes.\n\n## References\n\n${references}\n`);
  }
  if (entity.type === "technology") {
    return accentFrenchText(`## Role\n\nCette fiche documente ${title} comme technologie de reference pour ${topic}.\n\n## Usage\n\nElle situe la technologie dans l'ecosysteme Electronic Artefacts : ce qu'elle permet, quand elle devient pertinente et comment elle dialogue avec les autres composants du graphe.\n\n## Points d'attention\n\n- Les usages sont decrits en francais sans masquer les noms propres, acronymes ou standards techniques.\n- Les limites restent contextualisees par rapport aux projets, aux publications et aux contraintes d'implementation.\n\n## References\n\n${references}\n`);
  }
  return accentFrenchText(`## Définition\n\n${title} désigne ${topic}.\n\n## Usage\n\nCette fiche relie la notion aux projets, publications et technologies qui partagent un meme vocabulaire de conception. Elle sert de point d'appui pour naviguer dans le graphe en version francaise.\n\n## Perimetre\n\nLa notion est abordee par ses definitions, ses usages, ses limites et ses relations avec les autres objets documentes.\n\n## References\n\n${references}\n`);
};

const normalizeEntity = (fr, english) => {
  const title = accentFrenchText(titleFor(english, fr));
  const topic = topicFor(english || fr, title);
  const normalized = localizeRefs({ ...fr });
  normalized.title = title;
  if (normalized.subtitle === "Technical Article") normalized.subtitle = "Article technique";
  if (normalized.subtitle === "Research Note") normalized.subtitle = "Note de recherche";
  if (normalized.subtitle === "Case Study") normalized.subtitle = "Etude de cas";
  normalized.locale = "fr";
  normalized.abstract = genericAbstract(fr.type, title, topic);
  normalized.description = genericAbstract(fr.type, title, topic);
  normalized.sources = english?.sources || fr.sources;
  normalized.bibliography = english?.bibliography || fr.bibliography;
  normalized.tags = (english?.tags || fr.tags || []).map((tag) => accentFrenchText(tagMap.get(tag) || tag));
  normalized.disciplines = (english?.disciplines || fr.disciplines || []).map((tag) => accentFrenchText(tagMap.get(tag) || tag));

  if (fr.type === "concept") {
    normalized.definition = accentFrenchText(`${title} designe ${topic}.`);
    normalized.scope = [
      "définition du sujet",
      "contexte d'usage",
      "liens avec le graphe",
      "références associées",
    ];
    normalized.exclusions = [
      "les usages purement promotionnels sans définition vérifiable",
      "les exemples déconnectés des sources, relations ou contraintes du graphe",
    ];
    normalized.claims = [
      accentFrenchText(`${title} devient utile lorsque sa definition reste reliee a des sources, des pratiques et des objets observables.`),
      accentFrenchText(`La fiche sert de vocabulaire commun pour relier projets, publications et technologies sans melanger les langues.`),
    ];
  }

  if (fr.type === "technology") {
    normalized.roleInEcosystem = accentFrenchText(`${title} sert de repere technique pour evaluer ${topic}, ses usages possibles et ses consequences dans l'ecosysteme Electronic Artefacts.`);
  }

  if (fr.type === "publication") {
    normalized.claims = [
      accentFrenchText(`${title} doit etre lisible comme une synthese francaise autonome, sans phrases hybrides heritees de l'anglais.`),
      "Les liens avec les notions, projets et technologies du graphe renforcent la recherche, la navigation et la citation.",
    ];
    normalized.citation = {
      ...(fr.citation || {}),
      preferred: accentFrenchText(`Electronic Artefacts. "${title}". Article technique, version ${fr.version?.version || "1.0.0"}, 2026.`),
    };
  }

  if (fr.type === "collection") {
    const members = fr.explicitMembers?.length || 0;
    normalized.thesis = accentFrenchText(`${title} propose une lecture organisee de ${members || "plusieurs"} fiches reliees par un meme axe editorial.`);
    normalized.selectionNote = accentFrenchText(`La selection privilegie des contenus stables, reliables et utiles pour parcourir le hub de connaissance en francais.`);
  }

  if (fr.type === "researchField") {
    normalized.scope = [
      "questions de recherche",
      "hypothèses de conception",
      "prototypes et preuves",
      "relations avec le graphe public",
    ];
    normalized.questions = (fr.questions?.length ? fr.questions : [{ id: "rq-1", status: "open" }]).map((item, index) => ({
      id: item.id || `rq-${index + 1}`,
      status: item.status || "open",
      question: index === 0
        ? accentFrenchText(`Comment formaliser ${title} pour produire des interfaces, des preuves et des relations exploitables ?`)
        : accentFrenchText(`Quels usages de ${title} doivent rester ouverts a l'experimentation et a la verification ?`),
    }));
    normalized.findings = (fr.findings || []).map(() => accentFrenchText(`${title} demande une articulation claire entre vocabulaire, preuve et experience utilisateur.`));
    normalized.openQuestions = (fr.openQuestions || []).map(() => accentFrenchText(`Quels criteres permettent d'evaluer ${title} dans des situations concretes ?`));
  }

  return {
    data: normalized,
    body: bodyFor(fr, english, title, topic),
  };
};

const englishFiles = await fg("content/**/*.md", {
  cwd: rootDir,
  absolute: true,
  ignore: ["content/fr/**", "content/relations/**"],
});
const englishById = new Map();
for (const file of englishFiles) {
  const { data } = splitMarkdown(await readFile(file, "utf8"), file);
  englishById.set(data.id, data);
}

const frenchFiles = await fg("content/fr/**/*.md", { cwd: rootDir, absolute: true });
let changed = 0;
for (const file of frenchFiles.sort()) {
  const source = await readFile(file, "utf8");
  const { data } = splitMarkdown(source, file);
  if (!normalizeTypes.has(data.type) || !data.translationOf) continue;

  const english = englishById.get(data.translationOf);
  const { data: normalized, body } = normalizeEntity(data, english);
  const output = `---\n${stringify(normalized, { lineWidth: 100 }).trim()}\n---\n\n${body}`;
  if (output !== source) {
    await writeFile(file, output);
    changed += 1;
  }
}

process.stdout.write(`Normalized ${changed} French content records.\n`);
