/**
 * K EXPLORE — Event Data Store
 * Structured database of curated events across multiple categories.
 * Fully extensible, normalized data structure with realistic metadata.
 */

// Helper to generate dynamic upcoming dates so countdown timers always show realistic values
function getRelativeDate(daysOffset, hours = 9, minutes = 30) {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    target.setHours(hours, minutes, 0, 0);
    return target;
}

function formatDateString(dateObj) {
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTimeString(dateObj) {
    return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// 12 Realistic Multi-category Events + 1 Past Event to showcase closed status
const rawEvents = [
    {
        id: "ev-tech-01",
        title: "TechNexus Global AI & Cloud Summit 2026",
        category: "Technology",
        daysOffset: 4,
        hour: 9,
        minute: 30,
        endTime: "05:30 PM",
        venue: "Convention Center, Grand Ballroom",
        location: "K-Campus Tech District, Hub 1",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Explore breakthrough innovations in generative AI, quantum computing, and scalable cloud architectures with international leaders.",
        detailedDescription: "TechNexus 2026 brings together over 500 technologists, researchers, and engineers. Immerse yourself in keynotes from pioneers in machine learning, hands-on architectural sessions, live LLM deployment workshops, and an exclusive venture networking mixer. All attendees receive digital credentials, summit merchandise, and complimentary lunch.",
        organizer: "Faculty of Computing & Data Science",
        organizerContact: "technexus@kexplore.edu",
        capacity: 350,
        seatsLeft: 38,
        registrationStatus: "open",
        featured: true,
        price: "Free for Students / Pass Req.",
        tags: ["Artificial Intelligence", "Cloud Native", "Keynotes", "Networking"]
    },
    {
        id: "ev-hack-02",
        title: "HackKrypton 48-Hour National Hackathon",
        category: "Hackathons",
        daysOffset: 7,
        hour: 10,
        minute: 0,
        endTime: "48 Hours Continuous",
        venue: "Innovation & Incubation Hub, Wing B",
        location: "Central Tech Tower, 3rd Floor",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Form teams, build solutions for real-world civic and healthcare challenges, and compete for ₹2,50,000 in bounties.",
        detailedDescription: "HackKrypton is our flagship annual student hackathon where software engineering meets societal impact. Teams of 2 to 4 developers will prototype hardware/software solutions under high pressure. Includes round-the-clock mentor support, fast Wi-Fi, catered meals, midnight energy snacks, and top-tier judges from leading product companies.",
        organizer: "Developer Student Syndicate & ACM Chapter",
        organizerContact: "hackkrypton@kexplore.edu",
        capacity: 250,
        seatsLeft: 19,
        registrationStatus: "open",
        featured: true,
        price: "Free Entry",
        tags: ["Hackathon", "Web3", "HealthTech", "Cash Prizes"]
    },
    {
        id: "ev-mus-03",
        title: "Neon Horizon Electro & Indie Music Fest",
        category: "Music",
        daysOffset: 11,
        hour: 18,
        minute: 0,
        endTime: "11:00 PM",
        venue: "Open Air Amphitheatre",
        location: "K-Campus Lakeview Lawn",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "An electrifying evening featuring indie pop rock bands, synthwave DJs, immersive laser choreography, and food stalls.",
        detailedDescription: "Unwind under the stars with Neon Horizon. Experience high-octane live performances from campus rock bands and renowned guest indie artists. The festival features audio-visual synthwave sync, an artisanal food alley, interactive glow zones, and a dedicated chill lounge for students and music enthusiasts.",
        organizer: "Cultural Council & Music Society",
        organizerContact: "neonhorizon@kexplore.edu",
        capacity: 1200,
        seatsLeft: 184,
        registrationStatus: "open",
        featured: true,
        price: "Pass Required",
        tags: ["Live Music", "DJ Set", "Festival", "Outdoor"]
    },
    {
        id: "ev-spt-04",
        title: "Apex Arena Inter-College Esports & Sports Conclave",
        category: "Sports",
        daysOffset: 14,
        hour: 8,
        minute: 30,
        endTime: "07:30 PM",
        venue: "Indoor Stadium & Gaming Arena",
        location: "K-Sports Complex, Pavilion 2",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Compete in Valorant, EA FC, Badminton, and 3v3 Basketball in an adrenaline-pumping weekend championship.",
        detailedDescription: "Apex Arena bridges traditional athletics with competitive esports. Whether you excel on the hardwood court in 3v3 basketball or dominate the virtual server in tactical shooters, this conclave offers rigorous tournament brackets, live shoutcasting on campus screens, certified referees, and prestigious trophies.",
        organizer: "Sports Board & Esports Guild",
        organizerContact: "apexarena@kexplore.edu",
        capacity: 400,
        seatsLeft: 55,
        registrationStatus: "open",
        featured: true,
        price: "Team Registration",
        tags: ["Esports", "Athletics", "Championship", "Basketball"]
    },
    {
        id: "ev-bus-05",
        title: "VentureCatalyst Startup Pitch & Angel Investor Meet",
        category: "Business",
        daysOffset: 18,
        hour: 10,
        minute: 0,
        endTime: "04:30 PM",
        venue: "Auditorium Complex - Hall B",
        location: "Management Block, Level 2",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Pitch your startup idea to angel investors, network with serial entrepreneurs, and secure pre-seed grants.",
        detailedDescription: "VentureCatalyst is the premier bridge between student founders and the capital ecosystem. Ten shortlisted startups will present on stage before an angel panel managing over ₹50 Crore in assets. Features masterclasses on valuation, unit economics, term sheets, and 1-on-1 feedback sessions.",
        organizer: "E-Cell & Institutional Innovation Council",
        organizerContact: "venture@kexplore.edu",
        capacity: 180,
        seatsLeft: 12,
        registrationStatus: "open",
        featured: false,
        price: "Free Registration",
        tags: ["Startups", "Investment", "Pitching", "Venture Capital"]
    },
    {
        id: "ev-wsh-06",
        title: "System Design & Distributed Microservices Masterclass",
        category: "Workshops",
        daysOffset: 21,
        hour: 14,
        minute: 0,
        endTime: "06:30 PM",
        venue: "Advanced Computing Lab 402",
        location: "Computing Block, 4th Floor",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Deep dive into message queues, distributed caching, database sharding, and fault tolerance with senior software architects.",
        detailedDescription: "Designed for aspiring software engineers preparing for high-volume backend roles. You will write code and architect distributed systems step-by-step: implementing Kafka streams, Redis cluster failovers, rate limiters, and idempotency keys. Attendees must bring a laptop with Docker installed.",
        organizer: "Coders Club & Software Guild",
        organizerContact: "workshops@kexplore.edu",
        capacity: 80,
        seatsLeft: 8,
        registrationStatus: "open",
        featured: false,
        price: "Student ID Required",
        tags: ["Distributed Systems", "Backend", "Hands-on", "Architecture"]
    },
    {
        id: "ev-art-07",
        title: "Kalakriti Contemporary Art & Immersive Visuals Expo",
        category: "Art and Culture",
        daysOffset: 25,
        hour: 11,
        minute: 0,
        endTime: "08:00 PM",
        venue: "Central Arts Gallery",
        location: "Heritage Quadrangle",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "A multi-sensory exhibition celebrating traditional folk art, digital projection mapping, and experimental sculptures.",
        detailedDescription: "Kalakriti curates over 120 artworks from student artists and celebrated regional masters. The exhibition highlights the dialogue between traditional canvas work and futuristic digital art installations. Features live pottery wheels, calligraphy corners, and interactive light installations.",
        organizer: "Department of Fine Arts & Heritage Cell",
        organizerContact: "kalakriti@kexplore.edu",
        capacity: 500,
        seatsLeft: 140,
        registrationStatus: "open",
        featured: false,
        price: "Open Entry",
        tags: ["Visual Art", "Installations", "Culture", "Exhibition"]
    },
    {
        id: "ev-tech-08",
        title: "CyberShield National Cybersecurity & Red Teaming Conclave",
        category: "Technology",
        daysOffset: 29,
        hour: 9,
        minute: 0,
        endTime: "05:00 PM",
        venue: "Cyber Security Testing Arena",
        location: "Technology Tower, Basement 1",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Live capture-the-flag (CTF) tournament, threat hunting demos, reverse engineering labs, and bug bounty keynotes.",
        detailedDescription: "CyberShield unites ethical hackers, security analysts, and digital forensics investigators. Participate in a jeopardy-style CTF covering binary exploitation, web vulnerabilities, cryptography, and OSINT. Renowned industry penetration testers will demonstrate real-world attack vectors and defensive mitigation.",
        organizer: "Information Security Collective",
        organizerContact: "cybershield@kexplore.edu",
        capacity: 150,
        seatsLeft: 22,
        registrationStatus: "open",
        featured: false,
        price: "Free / Invite",
        tags: ["Cybersecurity", "CTF", "Ethical Hacking", "InfoSec"]
    },
    {
        id: "ev-hack-09",
        title: "CodeSprint 36H Green Tech & Sustainability Hack",
        category: "Hackathons",
        daysOffset: 34,
        hour: 9,
        minute: 30,
        endTime: "36 Hours",
        venue: "EcoDesign Studio & MakerSpace",
        location: "Sustainability Block, North Wing",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Harness IoT sensors, clean energy data, and AI algorithms to build high-impact sustainability prototypes.",
        detailedDescription: "CodeSprint focuses squarely on UN Sustainable Development Goals. Hackers will have access to campus IoT power grid APIs, solar generation telemetrics, and air quality monitor nodes. Build solutions for smart energy conservation, plastic recycling tracking, or eco-route navigation.",
        organizer: "Green Earth Initiative & IEEE Chapter",
        organizerContact: "codesprint@kexplore.edu",
        capacity: 160,
        seatsLeft: 34,
        registrationStatus: "open",
        featured: false,
        price: "Free Entry",
        tags: ["CleanTech", "IoT", "Sustainability", "Hackathon"]
    },
    {
        id: "ev-mus-10",
        title: "Acoustic Soul Classical & Sufi Fusion Night",
        category: "Music",
        daysOffset: 40,
        hour: 19,
        minute: 0,
        endTime: "10:30 PM",
        venue: "Open Stage & Lakeside Gazebo",
        location: "Campus Botanical Garden",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "An evocative musical evening blending classical Indian ragas, sarod & flute melodies, and contemporary acoustic percussion.",
        detailedDescription: "Immerse yourself in soul-stirring melodies surrounded by gentle lakeside breezes and warm lantern lighting. Acoustic Soul features acclaimed vocalists and instrumentalists performing Sufi poetry, Hindustani classical interpretations, and unplugged acoustic fusion.",
        organizer: "Society for Classical Music & Arts",
        organizerContact: "acousticsoul@kexplore.edu",
        capacity: 600,
        seatsLeft: 96,
        registrationStatus: "open",
        featured: false,
        price: "Open Pass",
        tags: ["Classical", "Sufi", "Acoustic", "Lakeside"]
    },
    {
        id: "ev-wsh-11",
        title: "ProductCraft: Zero-to-One UI/UX & Design Systems Sprint",
        category: "Workshops",
        daysOffset: 46,
        hour: 13,
        minute: 30,
        endTime: "06:00 PM",
        venue: "Design Media Lab 301",
        location: "School of Creative Media",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Hands-on UI/UX sprint covering Figma auto-layout, micro-interactions, tokenized design systems, and rapid user research.",
        detailedDescription: "Whether you are a developer looking to sharpen your product sense or a designer aspiring to craft scalable design tokens, this intensive masterclass equips you with industry-standard workflows. Build an interactive mobile app prototype from scratch and conduct rapid peer usability testing.",
        organizer: "Creative Designers Guild",
        organizerContact: "productcraft@kexplore.edu",
        capacity: 70,
        seatsLeft: 5,
        registrationStatus: "open",
        featured: false,
        price: "Free Registration",
        tags: ["Figma", "UI/UX", "Design Systems", "Prototyping"]
    },
    {
        id: "ev-spt-12",
        title: "K-Velocity National Inter-University Athletics Meet",
        category: "Sports",
        daysOffset: 55,
        hour: 7,
        minute: 0,
        endTime: "06:00 PM",
        venue: "Olympic Standard Athletic Track",
        location: "Main University Stadium",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Witness exhilarating 100m sprints, 4x100m relays, high jump, and decathlon competitions across 30 collegiate teams.",
        detailedDescription: "K-Velocity represents collegiate track & field at its pinnacle. Over 400 student athletes will compete across 18 events under certified international athletic rules. Features electronic timing gates, photo-finish replay cameras, and energetic spectator stands.",
        organizer: "Athletic Federation of K-Colleges",
        organizerContact: "velocity@kexplore.edu",
        capacity: 2500,
        seatsLeft: 720,
        registrationStatus: "open",
        featured: false,
        price: "Free Spectator Pass",
        tags: ["Athletics", "Track & Field", "Relay", "Championship"]
    },
    {
        id: "ev-past-13",
        title: "Genesis Web3 & Decentralized Autonomous Systems Expo",
        category: "Technology",
        daysOffset: -3, // Completed past event to demonstrate closed state handling
        hour: 10,
        minute: 0,
        endTime: "05:00 PM",
        venue: "Tech Auditorium Alpha",
        location: "Computing Block",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "A retrospective summit analyzing zero-knowledge proofs, smart contract security audits, and decentralized storage.",
        detailedDescription: "This flagship event has already taken place and concluded successfully. Over 300 delegates participated in auditing challenges and decentralized infrastructure workshops.",
        organizer: "Blockchain & Cryptography Society",
        organizerContact: "genesis@kexplore.edu",
        capacity: 200,
        seatsLeft: 0,
        registrationStatus: "closed",
        featured: false,
        price: "Archived",
        tags: ["Web3", "Blockchain", "Concluded"]
    }
];

// Initialize clean data objects with computed date values
const eventsData = rawEvents.map(item => {
    const eventDate = getRelativeDate(item.daysOffset, item.hour, item.minute);
    const deadlineDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before event
    
    return {
        id: item.id,
        title: item.title,
        category: item.category,
        dateTimeObj: eventDate,
        date: formatDateString(eventDate),
        time: formatTimeString(eventDate),
        isoDate: eventDate.toISOString(),
        endTime: item.endTime,
        venue: item.venue,
        location: item.location,
        image: item.image,
        shortDescription: item.shortDescription,
        detailedDescription: item.detailedDescription,
        organizer: item.organizer,
        organizerContact: item.organizerContact,
        registrationDeadline: formatDateString(deadlineDate),
        capacity: item.capacity,
        seatsLeft: item.seatsLeft,
        registrationStatus: item.registrationStatus,
        featured: item.featured,
        price: item.price,
        tags: item.tags
    };
});

// Category list for filter pills
const eventCategories = [
    "All",
    "Technology",
    "Hackathons",
    "Music",
    "Sports",
    "Business",
    "Workshops",
    "Art and Culture"
];
