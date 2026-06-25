(function () {
  const locale = document.documentElement.lang === "fr" || window.location.pathname.startsWith("/fr/")
    ? "fr"
    : "en";

  const translatedPages = new Map([
    ["/", "/fr/"],
    ["/index.html", "/fr/"],
    ["/work.html", "/fr/work.html"],
    ["/projects.html", "/fr/projects.html"],
    ["/about.html", "/fr/about.html"],
    ["/contact.html", "/fr/contact.html"],
  ]);

  const french = {
    "Skip to main content": "Aller au contenu principal",
    "Choose language": "Choisir la langue",
    "Translation not available yet": "Traduction non disponible pour le moment",
    "French version not available yet": "Version française non disponible pour le moment",
    "English version not available yet": "Version anglaise non disponible pour le moment",
    "HOME": "ACCUEIL",
    "WORK": "EXPERTISE",
    "PROJECTS": "PROJETS",
    "PROGRAMS": "PROGRAMMES",
    "RESEARCH": "RECHERCHE",
    "KNOWLEDGE": "CONNAISSANCES",
    "ARCHIVE": "ARCHIVES",
    "ABOUT": "À PROPOS",
    "CONTACT": "CONTACT",
    "PUBLICATIONS": "PUBLICATIONS",
    "SEARCH": "RECHERCHE",
    "LEGAL": "MENTIONS LÉGALES",
    "PRIVACY": "CONFIDENTIALITÉ",
    "Creative systems made visible.": "Rendre les systèmes créatifs visibles.",
    "Electronic Artefacts is a creative technology studio for client systems, proprietary platforms and research-led cultural publishing.": "Electronic Artefacts est un studio de technologies créatives dédié aux systèmes clients, aux plateformes propriétaires et à l’édition culturelle issue de la recherche.",
    "See selected work": "Voir nos expertises",
    "Start a project": "Démarrer un projet",
    "Client systems": "Systèmes clients",
    "Proprietary platforms": "Plateformes propriétaires",
    "Research": "Recherche",
    "Artistic publishing": "Édition artistique",
    "Now showing": "À découvrir",
    "Current products and public work": "Produits actuels et réalisations publiques",
    "Product surface": "Interface produit",
    "Public delivery": "Réalisation publique",
    "Culture": "Culture",
    "Current studio signals": "Indicateurs actuels du studio",
    "Current studio statistics": "Indicateurs actuels du studio",
    "current spotlights": "projets à la une",
    "latest update": "dernière mise à jour",
    "public surfaces": "interfaces publiques",
    "Latest platform": "Plateforme récente",
    "External CTO partnership": "Partenariat CTO externe",
    "Live public proof": "Réalisation publique active",
    "PROOF FIRST": "LA PREUVE D’ABORD",
    "One runtime foundation.": "Un socle d’exécution commun.",
    "Open the system line that explains how the studio thinks and builds.": "Découvrez le système qui structure la manière dont le studio pense et construit.",
    "RUNTIME FOUNDATION": "SOCLE D’EXÉCUTION",
    "Open the proprietary program behind the graph, identity and knowledge-system work.": "Découvrez le programme propriétaire derrière le graphe, l’identité et les systèmes de connaissance.",
    "Graph systems": "Systèmes de graphes",
    "Research engine": "Moteur de recherche",
    "Explore VASTE": "Découvrir VASTE",
    "Enter Research": "Explorer la recherche",
    "Quick preview": "Aperçu rapide",
    "FEATURED PATHS": "PARCOURS SÉLECTIONNÉS",
    "Start from your real question.": "Partez de votre vraie question.",
    "Choose the entry point that matches your intent before going deeper into the graph.": "Choisissez le point d’entrée qui correspond à votre intention avant d’explorer le graphe.",
    "Technology": "Technologie",
    "Understand the core runtime": "Comprendre le moteur central",
    "Open VASTE to inspect the strategic and technical foundation behind the wider family of systems.": "Découvrez VASTE pour comprendre le socle stratégique et technique de l’ensemble des systèmes.",
    "Why it matters": "Pourquoi c’est important",
    "Best when architecture, scalability and the long-term platform thesis matter first.": "À privilégier lorsque l’architecture, le passage à l’échelle et la vision de plateforme sont prioritaires.",
    "Delivery": "Réalisation",
    "Inspect applied work and outcomes": "Examiner les réalisations et leurs résultats",
    "See how strategy, interface, content and implementation hold together across commissions and public products.": "Voyez comment stratégie, interface, contenu et réalisation s’articulent dans les commandes et produits publics.",
    "Best when you need evidence of execution under concrete constraints.": "À privilégier lorsque vous cherchez des preuves de réalisation sous contraintes concrètes.",
    "See Client Work": "Voir les réalisations clients",
    "Enter through Palimpsests": "Entrer par Palimpsests",
    "Explore the musical and editorial surface where artistic production, memory and publication meet.": "Explorez l’espace musical et éditorial où se rencontrent création artistique, mémoire et publication.",
    "Best when you want the cultural register before the technical system.": "À privilégier pour découvrir le registre culturel avant le système technique.",
    "Enter Palimpsests": "Découvrir Palimpsests",
    "LAYER": "COUCHE",
    "Live ecosystem map.": "Cartographie vivante de l’écosystème.",
    "Real projects, programs and knowledge routes from the current Electronic Artefacts graph.": "Projets, programmes et parcours de connaissance issus du graphe actuel d’Electronic Artefacts.",
    "Knowledge": "Connaissances",
    "Runtime / active": "Moteur / actif",
    "Flagship platform": "Plateforme principale",
    "Client work / live": "Réalisation client / active",
    "Album / culture": "Album / culture",
    "Research field": "Domaine de recherche",
    "Concept records": "Fiches conceptuelles",
    "Memory layer": "Couche mémorielle",
    "Album cycle": "Cycle d’album",
    "Five acts": "Cinq actes",
    "Album cycle carried by ORETH. A single full surface, no nested panels.": "Cycle d’album porté par ORETH. Une surface unique et complète, sans panneaux imbriqués.",
    "Open Archive": "Ouvrir les archives",
    "Start a Collaboration": "Démarrer une collaboration",
    "Selected works.": "Réalisations sélectionnées.",
    "A compact path through client delivery, proprietary platforms and cultural publishing.": "Un parcours resserré entre réalisations clients, plateformes propriétaires et édition culturelle.",
    "CURATED PATH": "PARCOURS ÉDITORIAL",
    "Use this as the fast scan before entering the full project catalogue or archive.": "Utilisez ce parcours pour un aperçu rapide avant d’ouvrir le catalogue complet ou les archives.",
    "Lead": "Projet principal",
    "Mode": "Mode",
    "Browse Projects": "Parcourir les projets",
    "Browse Work Archive": "Voir les réalisations",
    "Open project": "Ouvrir le projet",
    "Work archive": "Réalisations",
    "MORE PATHS": "AUTRES PARCOURS",
    "CONTINUE EXPLORING": "POURSUIVRE L’EXPLORATION",
    "Use the ecosystem as a map, not a grid.": "Utilisez l’écosystème comme une carte, pas comme une grille.",
    "The next useful surface depends on what you came here for. These paths keep the structure intact while making the next move explicit.": "La prochaine destination dépend de votre objectif. Ces parcours préservent la structure tout en rendant l’étape suivante explicite.",
    "Move into public works and collaborations.": "Découvrez les réalisations publiques et les collaborations.",
    "Best if you want to see what the studio makes.": "Idéal pour voir ce que produit le studio.",
    "Enter the theoretical and experimental branches.": "Explorez les branches théoriques et expérimentales.",
    "Best if you want to understand the thinking behind the work.": "Idéal pour comprendre la réflexion derrière les réalisations.",
    "Inspect the software systems and runtime stack.": "Examinez les systèmes logiciels et leur socle d’exécution.",
    "Best if you want the operational core.": "Idéal pour découvrir le cœur opérationnel.",
    "Browse traces, fragments and historical material.": "Parcourez les traces, fragments et matériaux historiques.",
    "Best if you want context and depth.": "Idéal pour obtenir davantage de contexte et de profondeur.",
    "public works": "réalisations publiques",
    "program lines": "axes de programme",
    "live client proof": "référence client active",
    "Selected work": "Expertises sélectionnées",
    "Client systems and product surfaces.": "Systèmes clients et interfaces produit.",
    "Strategy, architecture, interface and implementation for teams that need a clear product, public surface or workflow system rather than a cosmetic refresh.": "Stratégie, architecture, interface et réalisation pour les équipes qui ont besoin d’un produit clair, d’une présence publique ou d’un système de travail — au-delà d’une simple refonte cosmétique.",
    "Discuss a project": "Parler d’un projet",
    "See evidence": "Voir les références",
    "Work disciplines": "Disciplines",
    "Strategy": "Stratégie",
    "Product": "Produit",
    "Identity": "Identité",
    "Implementation": "Réalisation",
    "Selected delivery": "Réalisations sélectionnées",
    "active surfaces": "interfaces actives",
    "Product platform": "Plateforme produit",
    "Work statistics": "Indicateurs des réalisations",
    "delivery contexts": "contextes de réalisation",
    "core disciplines": "disciplines centrales",
    "public proof": "référence publique",
    "CREATIVE CAPABILITIES": "CAPACITÉS CRÉATIVES",
    "One connected practice, from first question to final surface.": "Une pratique connectée, de la première question à l’interface finale.",
    "Electronic Artefacts brings direction, design, technology and cultural production into the same working system. The point is not to apply every discipline to every brief, but to assemble the right combination without losing coherence between the idea and its execution.": "Electronic Artefacts réunit direction, design, technologie et production culturelle dans un même système de travail. Il ne s’agit pas d’appliquer toutes les disciplines à chaque projet, mais de composer la bonne combinaison sans perdre la cohérence entre l’idée et sa réalisation.",
    "Typical tools": "Outils habituels",
    "What it produces": "Livrables",
    "Explore the map with pointer, touch or keyboard.": "Explorez la carte à la souris, au toucher ou au clavier.",
    "Direction · Design Technology · Culture": "Direction · Design Technologie · Culture",
    "Shape a capability mix": "Composer une équipe adaptée",
    "SERVICE FIELD": "CHAMP D’INTERVENTION",
    "Consulting, creative direction and implementation under one roof.": "Conseil, direction créative et réalisation réunis.",
    "Electronic Artefacts can enter at diagnosis, strategy, design, build, recovery or R&D level. The work can stay advisory, become a focused audit, or move all the way into production.": "Electronic Artefacts peut intervenir au niveau du diagnostic, de la stratégie, du design, de la réalisation, de la reprise ou de la R&D. La mission peut rester consultative, prendre la forme d’un audit ciblé ou aller jusqu’à la production.",
    "Typical entry points": "Points d’entrée habituels",
    "Useful when": "Pertinent lorsque",
    "Output": "Résultat",
    "ENGAGEMENTS": "FORMATS DE MISSION",
    "Three ways to work together.": "Trois façons de travailler ensemble.",
    "The format follows the problem. Each engagement produces explicit decisions, working artefacts and a clear next phase before scope or budget is locked.": "Le format suit le problème. Chaque mission produit des décisions explicites, des livrables opérationnels et une prochaine étape claire avant de figer le périmètre ou le budget.",
    "Qualification": "Qualification",
    "Problem first": "Le problème d’abord",
    "Evidence": "Preuves",
    "Live or documented": "En ligne ou documenté",
    "Handoff": "Transmission",
    "Reusable system": "Système réutilisable",
    "Discuss the right starting point": "Identifier le bon point de départ",
    "Review evidence": "Voir les références",
    "Projects, from art systems to applied surfaces.": "Des systèmes artistiques aux interfaces appliquées.",
    "Start with the artistic line, then compare client work, product surfaces and the systems that support them.": "Commencez par la ligne artistique, puis comparez les réalisations clients, les interfaces produit et les systèmes qui les soutiennent.",
    "A studio before an ecosystem.": "Un studio avant d’être un écosystème.",
    "Electronic Artefacts is an independent creative technology studio. It builds client systems, develops proprietary platforms, and publishes research and artistic work.": "Electronic Artefacts est un studio indépendant de technologies créatives. Il conçoit des systèmes clients, développe des plateformes propriétaires et publie des travaux de recherche et des œuvres artistiques.",
    "WHAT IT IS": "LE STUDIO",
    "LAYERS": "COUCHES",
    "ENTITIES": "ENTITÉS",
    "Studio model": "Modèle du studio",
    "One core / connected outputs": "Un noyau / des productions connectées",
    "Programs": "Programmes",
    "Projects": "Projets",
    "Archive": "Archives",
    "Studio statistics": "Indicateurs du studio",
    "independent studio": "studio indépendant",
    "connected layers": "couches connectées",
    "public edition": "édition publique",
    "Start with the problem, not the format.": "Partir du problème, pas du format.",
    "Electronic Artefacts works on digital products, knowledge systems, cultural platforms, creative technology and complex redesigns that need structural thinking.": "Electronic Artefacts travaille sur des produits numériques, des systèmes de connaissance, des plateformes culturelles, des technologies créatives et des refontes complexes qui demandent une réflexion structurelle.",
    "Build a project brief": "Construire un brief",
    "Send an email": "Envoyer un e-mail",
    "See the work": "Voir les réalisations",
    "Collaboration signal": "Signal de collaboration",
    "Unstructured idea → useful brief": "Idée libre → brief exploitable",
    "What should change?": "Qu’est-ce qui doit changer ?",
    "Start in your own words.": "Commencez avec vos propres mots.",
    "Who does it serve?": "À qui cela s’adresse-t-il ?",
    "Audience, system, constraints.": "Public, système, contraintes.",
    "A clear entry point.": "Un point de départ clair.",
    "Ready for a real conversation.": "Prêt pour une vraie discussion.",
    "direct route": "contact direct",
    "project pathways": "types de projet",
    "brief analysis": "analyse du brief",
    "Tell us what you’re working on.": "Décrivez ce sur quoi vous travaillez.",
    "Describe the idea that needs a system.": "Décrivez l’idée qui a besoin d’un système.",
    "What would you like to build together?": "Qu’aimeriez-vous construire ensemble ?",
    "What should exist that doesn’t exist yet?": "Qu’est-ce qui devrait exister et n’existe pas encore ?",
    "What would you like to create together?": "Qu’aimeriez-vous créer ensemble ?",
    "Describe your idea, project or collaboration": "Décrivez votre idée, votre projet ou votre collaboration",
    "PROJECT / COLLABORATION DISCOVERY": "DÉCOUVERTE DU PROJET / DE LA COLLABORATION",
    "What should exist that doesn’t exist yet?": "Qu’est-ce qui devrait exister et n’existe pas encore ?",
    "Describe the situation in your own words. This interface organizes your intent into a concise brief. Classification happens locally in your browser.": "Décrivez la situation avec vos propres mots. Cette interface organise votre intention dans un brief concis. L’analyse s’effectue localement dans votre navigateur.",
    "Start with a sentence. No formal brief required.": "Commencez par une phrase. Aucun brief formel n’est nécessaire.",
    "to continue": "pour continuer",
    "Likely pathway": "Orientation probable",
    "Clarifying intent": "Clarification de l’intention",
    "Detected signals": "Signaux détectés",
    "Confirm what matters.": "Confirmez ce qui compte.",
    "Add another signal": "Ajouter un autre signal",
    "Add": "Ajouter",
    "Relevant questions": "Questions pertinentes",
    "Give the idea enough context.": "Donnez suffisamment de contexte à l’idée.",
    "Contact details": "Coordonnées",
    "Where should the reply go?": "Où devons-nous répondre ?",
    "Name": "Nom",
    "Organization or practice": "Organisation ou activité",
    "optional": "facultatif",
    "LIVE BRIEF": "BRIEF EN DIRECT",
    "Your entry point": "Votre point de départ",
    "Intent captured": "Intention enregistrée",
    "Prepare email": "Préparer l’e-mail",
    "Copy brief": "Copier le brief",
    "Nothing is uploaded. “Prepare email” opens your mail application with the brief included.": "Aucune donnée n’est envoyée. « Préparer l’e-mail » ouvre votre messagerie avec le brief inclus.",
    "DIRECT ROUTES": "CONTACT DIRECT",
    "Prefer to contact us directly?": "Vous préférez nous contacter directement ?",
    "The discovery interface is optional. Email remains the primary route; public channels expose the studio's code, sound, research and ongoing work.": "L’interface de découverte est facultative. L’e-mail reste le moyen principal ; les canaux publics présentent le code, le son, la recherche et les travaux en cours du studio.",
    "Project briefs, partnerships, commissions and considered introductions.": "Briefs de projet, partenariats, commandes et prises de contact réfléchies.",
    "Send email": "Envoyer un e-mail",
    "Studio channel": "Canal du studio",
    "Studio updates, releases and public signals.": "Actualités du studio, publications et signaux publics.",
    "Open Instagram": "Ouvrir Instagram",
    "Visual observatory": "Observatoire visuel",
    "Visual research, references and observations.": "Recherche visuelle, références et observations.",
    "Code / sound / runtime": "Code / son / moteur",
    "Public surfaces": "Interfaces publiques",
    "Code, audio and the external VASTE runtime.": "Code, audio et moteur VASTE externe.",
    "CROSS NAVIGATION": "NAVIGATION",
    "Always one step away from another page.": "Toujours à un clic d’une autre page.",
    "Projects, music and technology.": "Projets, musique et technologie.",
    "Public works and extended dossiers.": "Réalisations publiques et dossiers détaillés.",
    "All visible programs.": "Tous les programmes visibles.",
    "Program, fields and notes.": "Programmes, domaines et notes.",
    "Living memory, evidence and reusable traces.": "Mémoire vivante, preuves et traces réutilisables.",
    "Positioning and network.": "Positionnement et réseau.",
    "Direct channels and links.": "Canaux directs et liens.",
    "Official external program.": "Programme externe officiel.",
    "Creative technology studio: client systems, proprietary platforms, research and artistic publishing.": "Studio de technologies créatives : systèmes clients, plateformes propriétaires, recherche et édition artistique.",
    "Quick links": "Liens rapides",
    "Section unavailable.": "Section indisponible.",
    "This part of the page could not be displayed for the moment.": "Cette partie de la page ne peut pas être affichée pour le moment.",
    "Notice": "Information",
    "Please continue with the rest of the page.": "Vous pouvez poursuivre avec le reste de la page.",
  };

  const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

  const translateText = (value) => {
    if (locale !== "fr") return value;
    const normalized = normalizeWhitespace(value);
    const translated = french[normalized];
    if (!translated) return value;
    const leading = value.match(/^\s*/)?.[0] || "";
    const trailing = value.match(/\s*$/)?.[0] || "";
    return `${leading}${translated}${trailing}`;
  };

  const localizeHref = (value) => {
    if (locale !== "fr" || !value || /^(mailto:|tel:|https?:|#)/.test(value)) return value;
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return value;
    const englishPath = url.pathname.startsWith("/fr/")
      ? url.pathname.slice(3) || "/"
      : url.pathname;
    const target = translatedPages.get(englishPath);
    url.pathname = target || englishPath;
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const localizeRoot = (root = document) => {
    if (locale !== "fr") return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE"].includes(node.parentElement?.tagName || "")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const translated = translateText(node.nodeValue || "");
      if (translated !== node.nodeValue) node.nodeValue = translated;
    });

    root.querySelectorAll?.("[placeholder], [title], [aria-label]").forEach((element) => {
      ["placeholder", "title", "aria-label"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (!value) return;
        const translated = translateText(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      });
    });
    root.querySelectorAll?.("a[href]").forEach((link) => {
      const value = link.getAttribute("href");
      const localized = localizeHref(value);
      if (localized !== value) link.setAttribute("href", localized);
    });
  };

  if (locale === "fr") {
    let localizationQueued = false;
    const observer = new MutationObserver(() => {
      if (localizationQueued) return;
      localizationQueued = true;
      window.queueMicrotask(() => {
        localizationQueued = false;
        localizeRoot(document);
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "href"],
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  window.EA_I18N = {
    locale,
    translateText,
    localizeHref,
    localizeRoot,
  };
})();
