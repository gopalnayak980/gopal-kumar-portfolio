// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Gopal Kumar",
  brandName: "Gopal Kumar",          // used for the big hero / footer typography
  role: "Full-Stack AI Developer",   // first word = bold, rest = light italic in the hero
  city: "Hazaribagh, Jharkhand, India",
  phone: "+91 7991132452",
  email: "gopal32452@gmail.com",
};

// academy export removed

export const socialLinks = {
  instagram: "",
  youtube: "",
  linkedin: "https://linkedin.com/in/gopalnayak2005",
  github: "https://github.com/gopalnayak980",
};

export const heroContent = {
  finalWord: "PORTFOLIO",            // the word the big text scrambles into
  ctaLabel: "Contact",
};

export const aboutContent = {
  heading: "Intro",
  greeting: "Hey, I'm Gopal.",
  paragraph:
    "I'm a Full-Stack AI Developer and B.Tech CSE student at Lovely Professional University, focused on building production-oriented web applications and intelligent software systems. I work across React, Node.js, Python, FastAPI, databases, and AI integrations to turn real-world ideas into complete products.",
  highlights: ["React", "Node.js", "Python", "FastAPI", "AI Agents", "MongoDB"],
};

export const skillRows = [
  { label: "Frontend", items: ["React.js", "Vite", "JavaScript", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Express.js", "Python", "FastAPI", "REST APIs"] },
  { label: "AI & Data", items: ["AI Agents", "Gemini AI", "Groq AI", "MongoDB", "PostgreSQL"] },
  { label: "Tools", items: ["Git", "GitHub", "Postman", "Vercel", "Render", "VS Code"] },
];

export const servicesContent = {
  headingLines: ["WHAT I", "CAN DO"],
  items: [
    {
      title: "FULL-STACK DEVELOPMENT",
      description:
        "I build complete web applications from frontend to backend, delivering responsive, secure, and production-ready digital experiences using modern frameworks and clean architecture.",
      capabilities: [
        "React",
        "Node.js",
        "Express.js",
        "REST APIs",
      ],
      cta: { label: "VIEW PROJECTS", href: "#projects" },
    },
    {
      title: "AI APPLICATION DEVELOPMENT",
      description:
        "I build AI-powered products and intelligent workflows that automate tasks, enhance user experiences, and solve real-world problems using cutting-edge AI technologies.",
      capabilities: [
        "Gemini AI",
        "Groq AI",
        "Python",
        "FastAPI",
      ],
    },
    {
      title: "BACKEND & API DEVELOPMENT",
      description:
        "I design secure and scalable backend systems with well-structured APIs, efficient databases, and authentication mechanisms to power modern web applications.",
      capabilities: [
        "FastAPI",
        "Node.js",
        "PostgreSQL",
        "MongoDB",
      ],
    },
    {
      title: "AI AGENT SYSTEMS",
      description:
        "I build multi-agent workflows with tools, memory, and human approval loops that orchestrate complex tasks using large language models and structured pipelines.",
      capabilities: [
        "Python",
        "FastAPI",
        "LLMs",
      ],
    },
  ],
};

// Words wrapped in *asterisks* are shown as light italic serif in gray.
export const projectsContent = {
  headingMain: "Selected",
  headingAccent: "work",
  description:
    "Production-oriented projects spanning full-stack development, AI integrations, voice assistants, and real-world business solutions.",
  readMore: { label: "Read More", href: "#projects" },
  items: [
    {
      id: "project-1",
      imageName: "devagent-cover",
      altText: "DevAgent AI software engineering platform",
      number: "01",
      title: ["DEVAGENT *ai*", "ORCHESTRATION PLATFORM"],
      description:
        "An AI-powered software engineering agent orchestration platform that breaks down complex development tasks into subtasks, assigns them to specialised AI agents, and coordinates the full workflow — from code generation to testing and deployment.",
      liveUrl: "https://dev-agent-woad.vercel.app/",
      githubUrl: "https://github.com/gopalnayak980/DevAgent",
    },
    {
      id: "project-2",
      imageName: "hireai-cover",
      altText: "HireAI job and career platform",
      number: "02",
      title: ["HIREAI", "JOB & CAREER PLATFORM"],
      description:
        "An AI-powered job and career platform that matches candidates with relevant opportunities, generates tailored resumes, and provides intelligent career recommendations using Gemini AI and real-time job data from the Adzuna API.",
      liveUrl: "https://hireai-blond.vercel.app",
      githubUrl: "https://github.com/gopalnayak980/hireai",
    },
    {
      id: "project-3",
      imageName: "jarvis-cover",
      altText: "JARVIS AI voice assistant",
      number: "03",
      title: ["JARVIS *ai*", "VOICE ASSISTANT"],
      description:
        "A personal AI voice assistant that listens to natural speech, processes commands with Gemini AI, and responds with intelligent answers — handling everything from web searches and conversations to task automation through a clean browser interface.",
      liveUrl: "https://jarvis-ai-8zh0.onrender.com",
      githubUrl: "https://github.com/gopalnayak980/jarvis-ai",
    },
    {
      id: "project-4",
      imageName: "building-material-cover",
      altText: "Building Material Supplier website",
      number: "04",
      title: ["BUILDING MATERIAL", "SUPPLIER"],
      description:
        "A real-world business website for a building material supplier featuring a product showcase, material calculator, quotation flow, and WhatsApp enquiry integration — built with vanilla web technologies and Google Maps for location services.",
      liveUrl: "https://jaimatadibuildingmaterial.com",
      githubUrl: "https://github.com/gopalnayak980/jai-mata-di-website",
    },
  ],
};

export const contactContent = {
  heading: "Get in touch",
  followLabel: "Follow me",
};

export const footerContent = {
  connectLabel: "Connect with me",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
  ],
  ctaHeading: "Let's build something",
  ctaText: "Open for freelance opportunities and collaborations.",
  ctaLabel: "Get in touch",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
