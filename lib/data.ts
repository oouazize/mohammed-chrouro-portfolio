export interface Image {
	id: string;
	title: string;
	image: string;
}

export interface Collection {
	id: string;
	name: string;
	images: Image[];
}

// Artist information for easy customization
export const artistInfo = {
	name: "Mohammed Chrouro",
	bio: [
		"Mohammed Chrouro est un artiste conceptuel marocain dont le travail s'inscrit dans le courant post-Internet. Fondateur de la «Nouvelle Esthétique Marocaine», un sous-mouvement qui réinterprète les codes numériques à travers une sensibilité locale, il explore les enjeux émotionnels et esthétiques du numérique.",
		"Entre 2008 et 2014, il crée des sites internet qu'il conçoit comme des œuvres autonomes. Ces plateformes, composées principalement de dégradés, exploitent l'écran comme médium artistique, ouvrant une nouvelle voie dans l'art numérique marocain. En 2012, il commence à exposer ces œuvres exclusivement digitales, qui marquent un tournant dans sa réflexion sur l'impact des transitions chromatiques comme langage émotionnel.",
		"En 2015, il publie le manifeste Emotional Gradients, un texte poétique dans lequel il développe sa vision du dégradé comme déclencheur d'émotions universelles et outil d'exploration des états de transition. Ce travail, à la croisée de l'art et de la philosophie, consolide son approche unique de la peinture numérique comme expérience affective.",
		"À partir de 2016, Chrouro élargit son champ de recherche en construisant un «imaginaire concret» où anarchie et ordre, beauté et horreur coexistent. À travers des images de synthèse déclinées en vidéos, installations et peintures digitales, il interroge les tensions et contradictions d'un monde hyperconnecté, offrant une vision poétique et critique de la modernité.",
		"En 2023, il crée l'œuvre Sans titre en réponse au tremblement de terre dans la région d'Al Haouz. Présentée lors de la foire Paris Internationale dans l'exposition-vente caritative Drawing for Morocco, cette pièce intègre ensuite la collection du Centre Pompidou, confirmant sa reconnaissance internationale.",
		"Chrouro poursuit aujourd'hui son exploration des potentialités numériques, redéfinissant les notions de beauté et d'émotion à l'écran. Son œuvre, ancrée dans le post-Internet, propose une lecture visionnaire de l'avenir des esthétiques contemporaines.",
	],
	exhibitions: [
		"Mastermind 1. Casablanca, Morocco",
		"Text and Exhibition. Zurich, Switzerland",
		"Tumblr Unlimited. Chicago, USA",
		"Couvent des Recollets. Paris, France",
		"Light of Century. Gwangju, South Korea",
		"Exhibition off Gwangju Biennale. Seoul, South Korea",
		"First drawings from The Arab Internet. Casablanca, Morocco",
		"In The Kingdom. Miami, USA",
		"Art of this Century. Casablanca, Morocco",
		"The Gradients of Internet. Casablanca, Morocco",
		"Code Review. Casablanca, Morocco",
		"Love Yves Saint Laurent. Evora, Portugal",
		"Curatorial focus on Artists from the Maghreb. Abu Dhabi, UAE",
		"Unis pour le Maroc. Rabat, Morocco",
		"A drawing for Morocco. Paris, France",
	],
	publications: [
		"i-D",
		"Vogue Italia",
		"ODDA magazine",
		"The Greatest magazine",
		"The Modern House",
		"Rivista Studio",
		"Openhouse",
		"Pylot, amongst others.",
	],
	clients: [
		"Salvatore Ferragamo",
		"Fendi",
		"MSGM",
		"Trussardi",
		"Home of Hai",
		"Modes",
		"Fav",
	],
	contact: {
		personal: {
			email: "contact@mohammedchrouro.com",
			instagram: "mohammedchrouro",
			phone: "",
		},
		agency: {
			name: "GVCC",
			agent: "Lauren@gvcc.art",
			phone: "+212 6 61 42 26 61",
			website: "www.gvcc.art",
		},
	},
};

// Cache for collections and images
let cachedCollections: Collection[] = [];
let cachedImages: Image[] = [];

// Function to fetch collections from our API
export async function fetchCollections(): Promise<Collection[]> {
	// If we already have collections cached, return them
	if (cachedCollections.length > 0) {
		return cachedCollections;
	}

	try {
		const response = await fetch("/api/images");
		if (!response.ok) {
			throw new Error("Failed to fetch collections");
		}

		const data = await response.json();
		cachedCollections = data.collections;

		// Also update the cached images by flattening all collection images
		cachedImages = cachedCollections.flatMap((collection) => collection.images);

		return cachedCollections;
	} catch (error) {
		console.error("Error fetching collections:", error);
		return [];
	}
}

// Function to fetch all images (flattened from collections)
export async function fetchImages(): Promise<Image[]> {
	// If we already have images cached, return them
	if (cachedImages.length > 0) {
		return cachedImages;
	}

	// Fetch collections first, which will populate cachedImages
	await fetchCollections();
	return cachedImages;
}

// For compatibility with existing code
export async function getAllImages(): Promise<Image[]> {
	return fetchImages();
}

// Get first image from each collection for list view
export async function getCollectionPreviews() {
	const collections = await fetchCollections();
	return collections.map((collection) => ({
		...collection,
		previewImage: collection.images[0],
	}));
}

export const collections: Collection[] = [
	{
		id: "absolute-beginners",
		name: "Absolute beginners",
		images: [
			{
				id: "001",
				title: "Asta 06",
				image:
					"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "002",
				title: "Portrait Study 01",
				image:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "003",
				title: "Light and Shadow",
				image:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "butterfly-tulip",
		name: "The Butterfly and the Tulip",
		images: [
			{
				id: "004",
				title: "Metamorphosis I",
				image:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "005",
				title: "Metamorphosis II",
				image:
					"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "006",
				title: "Nature's Dance",
				image:
					"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "cobalto",
		name: "Cobalto",
		images: [
			{
				id: "007",
				title: "Blue Depths",
				image:
					"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "008",
				title: "Cobalt Dreams",
				image:
					"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "together-we-count",
		name: "Together we count, together we fall",
		images: [
			{
				id: "009",
				title: "Unity 01",
				image:
					"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "010",
				title: "Unity 02",
				image:
					"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "011",
				title: "Unity 03",
				image:
					"https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "swans",
		name: "Swans",
		images: [
			{
				id: "012",
				title: "Grace in Motion",
				image:
					"https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "013",
				title: "Reflection",
				image:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "home-of-hai",
		name: "Home of Hai",
		images: [
			{
				id: "014",
				title: "Interior Spaces",
				image:
					"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "015",
				title: "Architectural Study",
				image:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "body-crafted",
		name: "Body crafted object NU Vocabolario",
		images: [
			{
				id: "016",
				title: "Form and Function",
				image:
					"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "alaia",
		name: "Alaia",
		images: [
			{
				id: "017",
				title: "Fashion Study",
				image:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
			},
			{
				id: "018",
				title: "Textile Exploration",
				image:
					"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
	{
		id: "miu-miu",
		name: "Miu Miu",
		images: [
			{
				id: "019",
				title: "Contemporary Fashion",
				image:
					"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=60",
			},
		],
	},
];
