export const personal = {
    name: 'Job Mooij',
    title: 'Backend & Security Engineer',
    tagline: "I build resilient Python systems; observable, containerised, and honest about what they're doing.",
    email: 'cost-tipster5l@icloud.com',
};

export type SkillGroup = {
    category: string;
    items: string[];
};

export const skills: SkillGroup[] = [
    {
        category: 'Backend & APIs',
        items: ['Python', 'FastAPI', 'Django', 'Flask', 'Dash'],
    },
    {
        category: 'Security & scanning',
        items: ['Trivy', 'Vulnerability scanning in CI/CD', 'Container hardening'],
    },
    {
        category: 'Containers & infra',
        items: ['Docker', 'Podman', 'Automated image pipelines', 'AWS (EC2, RDS, S3)'],
    },
    {
        category: 'Monitoring & observability',
        items: ['Structured error logging', 'System monitoring', 'Alerting pipelines'],
    },
    {
        category: 'Data & automation',
        items: ['Scraping pipelines', 'Data processing', 'Selenium'],
    },
    {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MonetDB'],
    },
    {
        category: 'CI/CD & testing',
        items: ['GitHub Actions', 'Selenium', 'Unit testing', 'Git'],
    },
    {
        category: 'Other languages',
        items: ['R (ggplot2, Shiny)', 'Java (Hadoop)', 'C++', 'JavaScript'],
    },
];

// ─────────────────────────────────────────────

export type ExperienceItem = {
    role: string;
    company: string;
    period: string;
    bullets: string[];
};

export const experience: ExperienceItem[] = [
    {
        role: 'Bachelor Bio informatics',
        company: 'University of applied sciences Leiden',
        period: '2016 - 2020',
        bullets: ['Combine and learn IT skills with data originating from organisms']
    },
    {
        role: 'Internship',
        company: 'Core Life Analytics',
        period: '2019 - 2020',
        bullets: ['Create interactive application for biologists to explore their own experiment data']
    },
    {
        role: 'MSc Data Science',
        company: 'Leiden University',
        period: '2020 - 2022',
        bullets: ['Focus more on data coming from anywhere, with a focus on design, scalability and security']
    },
    {
        role: 'Full stack developer',
        company: 'Core Life Analytics',
        period: '2020 - 2024',
        bullets: [
            'Create AWS EC2 spot batch processing system for efficient data processing',
            'Develop automated CI/CD pipeline from image creation to unit and integration testing',
            'Created the StratoVerse platform, a major overhaul of the existing StratoMineR platform that included significant backend improvements, database optimizations, and API enhancements'
        ]
    },
    {
        role: 'Python Backend Developer',
        company: 'KATE Innovations',
        period: '2024 - present',
        bullets: [
            'Built automated container image pipelines using Docker and Podman, enabling one-click deployments of reproducible, up-to-date environments',
            'Integrated Trivy vulnerability scanning, establishing continuous container security monitoring across all production images'
        ]
    },
];
