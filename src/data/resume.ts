export const profile = {
  name: "Pranav Cavaturu",
  role: "Full-stack engineer, Founder, and Filmmaker",
  email: "hi@cavaturu.com",
  linkedin: "https://linkedin.com/in/cavaturu",
  github: "https://github.com/ItsPranavC",
  education: {
    school: "The University of Texas at Austin",
    degree: "B.S. in Radio-Television-Film",
    extra: "Certificate in Programming and Computation",
    grad: "May 2029",
    location: "Austin, TX",
  },
};

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  color: string;
  logo?: string;
  bullets: string[];
}

export const experience: Experience[] = [
  {
    id: "xray",
    company: "XRAY Commerce",
    role: "Software Engineering Intern",
    period: "May 2026 – Sep 2026",
    location: "Remote",
    color: "#ff9f0a",
    logo: "/icons/companies/xray.png",
    bullets: [
      "Built an AI video-generation pipeline turning a single product photo into cinematic ad videos, cutting studio-quality ad production to minutes by orchestrating diffusion models with anti-hallucination prompting.",
      "Improved generated-ad fidelity to real products by engineering a vision-language model verification step that automatically flags and regenerates outputs failing product-accuracy checks.",
      "Increased apparel ad realism by developing an identity-preserving virtual try-on module that defaults garments to on-model shots instead of flat product images.",
    ],
  },
  {
    id: "scripy",
    company: "Scripy",
    role: "Founder & Full-Stack Engineer",
    period: "Apr 2026 – Present",
    location: "Austin, TX",
    color: "#bf5af2",
    logo: "/icons/scripy.svg",
    bullets: [
      "Grew an AI screenwriting platform to 100+ active filmmakers at UT Austin through organic marketing by shipping a full-stack Fountain-format editor that takes a screenplay from concept to production-ready outputs.",
      "Enabled writers to skip $100–$400 in professional fees by building an AI script-coverage tool that scores screenplays across 8 studio-standard dimensions and returns industry-format feedback.",
      "Saved production teams 4–8 hours per script revision by developing an engine that auto-generates per-scene production breakdowns on every screenplay edit.",
    ],
  },
  {
    id: "longhorn",
    company: "Longhorn Developers",
    role: "Software Developer",
    period: "Sep 2025 – Present",
    location: "Austin, TX",
    color: "#ff6b35",
    logo: "/icons/companies/longhorn.png",
    bullets: [
      "Shipped features to production on a 15+ engineer Agile team, building React/TypeScript components and merging pull requests through CI/CD.",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  year: string;
  stack: string[];
  summary: string;
  bullets: string[];
  color: string;
  icon: "film" | "heart" | "map" | "pen";
  /** real product logo, shown instead of the emoji glyph */
  image?: string;
  /** live site, opened via the matching in-OS app */
  url?: string;
}

export const projects: Project[] = [
  {
    id: "kubrick",
    name: "Kubrick",
    year: "2026",
    stack: ["Python", "FastAPI", "PyTorch", "Modal", "Transformers", "React", "TypeScript"],
    summary:
      "Predicts per-shot audience neural response to video, letting filmmakers score trailers for attention before release.",
    bullets: [
      "Enabled filmmakers to score trailers for predicted audience attention by engineering and deploying a system that forecasts per-shot viewer neural response to video, built on top of the Tribe V2 model.",
      "Powered model inference by building an end-to-end pipeline that segments video with ffmpeg, transcribes speech with WhisperX, and extracts audio features for feature-level prediction.",
      "Cut infrastructure overhead by deploying the model as a serverless endpoint on Modal, securing webhooks with HMAC authentication to sanitize incoming jobs and persist outputs.",
    ],
    color: "#ff375f",
    icon: "film",
    image: "/icons/kubrick.svg",
    url: "https://kubrick.to",
  },
  {
    id: "echo",
    name: "Echo",
    year: "2026",
    stack: ["macOS", "AI", "iMessage", "Local-first", "Open Source"],
    summary:
      "AI chatbot that imitates how any of your contacts talk, trained on your synced iMessage conversations. Private, local, open-source macOS app.",
    bullets: [
      "Imitates the texting style of any of your contacts by learning from your synced iMessage conversation history.",
      "Runs fully private and local on your Mac — your messages never leave your machine.",
      "Free and open source.",
    ],
    color: "#b44bd9",
    icon: "pen",
    image: "/icons/echo.svg",
    url: "https://echotexts.vercel.app",
  },
  {
    id: "scripy",
    name: "Scripy",
    year: "2026",
    stack: ["Next.js", "TypeScript", "React", "Convex", "Stripe", "Clerk"],
    summary:
      "AI screenwriting platform used by 100+ filmmakers at UT Austin, from Fountain-format editing to studio-style script coverage.",
    bullets: [
      "Full-stack Fountain-format editor that takes a screenplay from concept to production-ready outputs.",
      "AI script-coverage tool that scores screenplays across 8 studio-standard dimensions and returns industry-format feedback, saving writers $100–$400 in professional fees.",
      "Engine that auto-generates per-scene production breakdowns on every screenplay edit, saving teams 4–8 hours per revision.",
    ],
    color: "#bf5af2",
    icon: "pen",
    image: "/icons/scripy.svg",
    url: "https://scripy.io",
  },
  {
    id: "b3vo",
    name: "B3VO AI",
    year: "2026",
    stack: ["React Native", "Expo", "TypeScript", "ElevenLabs", "Twilio"],
    summary:
      "Anonymous AI mental-health companion for UT Austin students, delivered over SMS/iMessage with a local-first native iOS app.",
    bullets: [
      "Delivered an anonymous AI mental-health companion to UT Austin students over SMS and iMessage by fine-tuning conversational flows on Cognitive Behavioral Therapy and mindfulness techniques.",
      "Drove sustained engagement by building a native iOS app with daily habit tracking (sleep, nutrition, mood, journaling) and streak logic, plus guided breathing and ElevenLabs-narrated body scans.",
      "Guaranteed user privacy by architecting a local-first app with anonymous device identity and no cloud dependency.",
    ],
    color: "#30d158",
    icon: "heart",
    image: "/icons/b3vo.svg",
  },
  {
    id: "campus",
    name: "CAMPUS",
    year: "2025",
    stack: ["React Native", "TypeScript", "Node.js"],
    summary:
      "Social-discovery platform unifying campus events, fundraisers, a peer marketplace, and gamified quests into one product.",
    bullets: [
      "Unified fragmented campus tools into one product by building a social-discovery platform combining event discovery, fundraisers, a peer marketplace, and gamified campus quests.",
      "Increased content engagement by designing and building Buzz, a campus-scoped anonymous short-form video feed that lets posts embed a linked event, fundraiser, or marketplace listing.",
    ],
    color: "#0a84ff",
    icon: "map",
    image: "/icons/campus.svg",
  },
];

export const skills = {
  Languages: ["Python", "Java", "C/C++", "TypeScript", "JavaScript", "SQL", "HTML/CSS"],
  Frameworks: [
    "React",
    "React Native",
    "Expo",
    "Next.js",
    "Node.js",
    "FastAPI",
    "PyTorch",
    "Transformers",
    "Tailwind CSS",
    "Three.js",
  ],
  "Cloud & Infra": ["AWS (S3)", "Cloudflare R2", "Modal", "Docker", "CI/CD", "Convex"],
  "Developer Tools": ["Git", "Stripe", "Clerk", "REST APIs"],
  Concepts: [
    "Data Structures & Algorithms",
    "Distributed Systems",
    "Unit Testing",
    "Vision-Language Models",
    "LLM Prompting",
  ],
};
