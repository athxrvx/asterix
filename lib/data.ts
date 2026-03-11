export const projects = [
    {
        id: "01",
        title: "Garnet",
        category: "Private AI",
        year: "2025",
        image: "/projects/project-01.jpg",
        status: "Beta"
    },
    {
        id: "02",
        title: "Garnet Studio",
        category: "Private AI",
        year: "2025",
        image: "/projects/project-01.png",
        status: "Beta"
    },
    {
        id: "03",
        title: "Sentinel",
        category: "Tracking & Productivity",
        year: "2026",
        image: "/projects/project-01.jpg",
        status: "Alpha"
    },
    {
        id: "04",
        title: "VivasAI",
        category: "Agricultural AI",
        year: "2025",
        image: "/projects/project-01.png",
        status: "v1.0.2"
    },
    {
        id: "05",
        title: "Elysium",
        category: "The free alternative",
        year: "2026",
        image: "/projects/project-01.jpg",
        status: "WIP"
    }
];

export type Article = {
    slug: string
    title: string
    type: string
    date: string
    excerpt: string
    author: string
    readTime: string
    coverImage: string
    markdown: string
}

export const articles: Article[] = [
    {
        slug: "building-reliable-campus-ai-agents",
        title: "Building Reliable Campus AI Agents",
        type: "ENGINEERING",
        date: "MAR 05",
        excerpt: "A practical breakdown of tooling, evals, and deployment guardrails we used to ship dependable student-built AI agents.",
        author: "Asterix Engineering Cell",
        readTime: "6 min read",
        coverImage: "/projects/project-01.jpg",
        markdown: `## Why reliability first

Reliable agents are less about one perfect model and more about system design. We started by defining explicit success and failure conditions for every workflow.

## The production loop we use

1. Retrieve trusted context.
2. Reason with explicit constraints.
3. Validate output before any external action.

### Core stack

- Prompt contracts for every route
- Lightweight evals for weekly checks
- Safe fallback responses for unknown states

![Engineering flow map](/projects/project-02.jpg)

## Operational guideline

~~~ts
type Guardrail = {
  check: (output: string) => boolean
  fallback: string
}
~~~

Staged rollout, logging, and rollback paths helped us ship faster while staying dependable for real student use.`
    },
    {
        slug: "ethics-of-synthetic-dreams",
        title: "The Ethics of Synthetic Dreams",
        type: "CREATIVE",
        date: "FEB 02",
        excerpt: "What responsibility do we carry when machine-generated outputs feel emotionally human?",
        author: "Asterix Creative Desk",
        readTime: "4 min read",
        coverImage: "/projects/project-02.jpg",
        markdown: `## A design responsibility

Generative systems do not feel emotion, but they can still trigger emotional responses. That creates a responsibility for builders.

## What we evaluate now

- Tone and implied intent
- Trust and authority cues
- Misuse potential in sensitive contexts

> Ethics is not a post-launch checklist. It is part of the design process.

![Creative reflection](/projects/project-01.jpg)

Our club now reviews emotional impact alongside performance metrics for every public-facing prototype.`
    },
    {
        slug: "optimizing-transformer-latency",
        title: "Optimizing Transformer Latency",
        type: "TECHNICAL",
        date: "JAN 28",
        excerpt: "Fast inference requires disciplined engineering across prompts, architecture, and runtime infrastructure.",
        author: "Asterix Systems Team",
        readTime: "5 min read",
        coverImage: "/projects/project-01.jpg",
        markdown: `## Start with measurement

Latency work starts before infrastructure. Prompt shape impacts token count, and token count drives time and cost.

## Practical wins

1. Stream responses early.
2. Cache repeated context.
3. Batch compatible requests.

## Rule of thumb

Measure every layer, optimize the slowest one, and repeat. Systems improve when feedback loops are short.

![Latency dashboard](/projects/project-02.jpg)`
    },
    {
        slug: "generative-architecture-patterns",
        title: "Generative Architecture Patterns",
        type: "RESEARCH",
        date: "JAN 15",
        excerpt: "A short field guide to recurring patterns in modern AI-native product architecture.",
        author: "Asterix Research Cell",
        readTime: "5 min read",
        coverImage: "/projects/project-02.jpg",
        markdown: `## Repeatable patterns

Most successful AI products use a coordinator pattern: route, retrieve, reason, validate, then act.

### Why composability wins

- Retrieval can evolve independently
- Memory can be swapped safely
- Orchestration remains testable

Good architecture is less about complexity and more about crisp boundaries between responsibilities.`
    },
    {
        slug: "decentralized-intelligence",
        title: "Decentralized Intelligence",
        type: "THEORY",
        date: "DEC 10",
        excerpt: "Decentralized networks could improve privacy, resilience, and ownership in AI ecosystems.",
        author: "Asterix Theory Group",
        readTime: "4 min read",
        coverImage: "/projects/project-01.jpg",
        markdown: `## A different trade-off

Centralized AI simplifies iteration but increases concentration risk. Decentralized intelligence explores privacy, ownership, and resilience.

### Design questions we care about

1. Who controls model behavior?
2. How is data permission managed?
3. Who benefits from value creation?

Community-governed intelligence is difficult to orchestrate, but it is a major opportunity for student-led research.`
    },
    {
        slug: "sound-of-algorithms",
        title: "The Sound of Algorithms",
        type: "ART",
        date: "NOV 22",
        excerpt: "Turning model behavior into audio can reveal patterns we miss in charts and logs.",
        author: "Asterix Art Lab",
        readTime: "3 min read",
        coverImage: "/projects/project-02.jpg",
        markdown: `## Hearing model behavior

Data sonification maps model signals into sound. Confidence can become pitch, uncertainty can become texture, and drift can become rhythm.

> Art experiments often become technical insights.

![Sonification concept](/projects/project-01.jpg)

This practice gave us a new way to debug and explain system behavior to non-technical audiences.`
    },
];

export type Event = {
    id: number
    slug: string
    date: string
    title: string
    type: string
    seats: 'OPEN' | 'FULL' | 'LIMITED'
    venue: string
    time: string
    summary: string
    details: string[]
    registerUrl: string
}

export const events: Event[] = [
    {
        id: 1,
        slug: 'generative-audio-workshop',
        date: '03.12',
        title: 'Generative Audio Workshop',
        type: 'WORKSHOP',
        seats: 'FULL',
        venue: 'Innovation Lab, CSE Block',
        time: '4:30 PM - 6:30 PM',
        summary: 'Hands-on workshop on using diffusion and transformer models for sound generation.',
        details: [
            'Intro to generative audio workflows and open source model stacks.',
            'Live demo: text to ambient sound and voice texture transfer.',
            'Mini challenge and peer review at the end of the session.'
        ],
        registerUrl: 'https://forms.gle/asterix-audio-workshop'
    },
    {
        id: 2,
        slug: 'on-device-llm-build-night',
        date: '03.18',
        title: 'On-Device LLM Build Night',
        type: 'BUILD SESSION',
        seats: 'OPEN',
        venue: 'Systems Lab 2, EEC',
        time: '5:00 PM - 8:00 PM',
        summary: 'Build practical local-first LLM prototypes with quantized models and lightweight runtimes.',
        details: [
            'Setup session for local inference toolchains.',
            'Build a campus assistant with retrieval and prompt routing.',
            'Performance tuning and deployment discussion.'
        ],
        registerUrl: 'https://forms.gle/asterix-build-night'
    },
    {
        id: 3,
        slug: 'cybernetics-symposium',
        date: '04.05',
        title: 'Cybernetics Symposium',
        type: 'TALK',
        seats: 'OPEN',
        venue: 'Main Seminar Hall',
        time: '10:00 AM - 1:00 PM',
        summary: 'Speaker session on feedback systems, adaptive control, and intelligence in modern products.',
        details: [
            'Guest talks from academia and industry practitioners.',
            'Panel discussion on AI safety and system-level reliability.',
            'Open Q&A for student projects.'
        ],
        registerUrl: 'https://forms.gle/asterix-symposium'
    },
    {
        id: 4,
        slug: 'prompt-engineering-clinic',
        date: '04.12',
        title: 'Prompt Engineering Clinic',
        type: 'CLINIC',
        seats: 'OPEN',
        venue: 'Design Studio, CSE',
        time: '3:00 PM - 5:00 PM',
        summary: 'Structured clinic to improve prompt quality, reliability, and evaluation discipline.',
        details: [
            'Frameworks for prompt decomposition and constraint writing.',
            'Prompt testing checklists for edge-case handling.',
            'Hands-on review of participant prompts.'
        ],
        registerUrl: 'https://forms.gle/asterix-prompt-clinic'
    },
    {
        id: 5,
        slug: 'render-realtime-hackathon',
        date: '04.22',
        title: 'Render/Realtime Hackathon',
        type: 'HACKATHON',
        seats: 'OPEN',
        venue: 'Tech Arena, EEC',
        time: '9:00 AM - 6:00 PM',
        summary: 'One-day sprint to build realtime AI tools, visual systems, and interactive demos.',
        details: [
            'Team formation and challenge briefing in the morning.',
            'Mentor checkpoints through the day.',
            'Final demos and awards in the evening.'
        ],
        registerUrl: 'https://forms.gle/asterix-hackathon'
    },
    {
        id: 6,
        slug: 'ai-product-demo-day',
        date: '05.03',
        title: 'AI Product Demo Day',
        type: 'SHOWCASE',
        seats: 'LIMITED',
        venue: 'Auditorium, EEC',
        time: '2:00 PM - 5:30 PM',
        summary: 'Showcase of student-built AI products with jury feedback and collaboration opportunities.',
        details: [
            'Shortlisted teams present working prototypes.',
            'Live feedback from faculty and invited guests.',
            'Networking session and recruitment announcements.'
        ],
        registerUrl: 'https://forms.gle/asterix-demo-day'
    },
];

export const team = [
    { name: "Alex Chen", role: "Systems Architect", image: "/team/alex.jpg" },
    { name: "Sarah Jones", role: "AI Researcher", image: "/team/sarah.jpg" },
    { name: "Mike Ross", role: "Frontend Engineer", image: "/team/mike.jpg" },
    { name: "Emily White", role: "Product Designer", image: "/team/emily.jpg" },
];
