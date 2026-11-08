import type { ImageMetadata } from 'astro';
import { siGit, siJavascript, siLaravel, siMysql, siPhp, siReact, siTailwindcss, siTypescript } from 'simple-icons';
// To add your photo: put it in src/assets/ and uncomment the import + the `photo` line below.
// import photo from './assets/photo.jpg';

export interface SiteConfig {
  name: string;
  role: string;
  studentLine: string;
  status: string;
  graduationYear: string;
  location: string;
  bio: string;
  email: string;
  socials: { github: string; linkedin: string };
  cvPath: string;
  photo?: ImageMetadata;
  /** `icon` is an SVG path (24×24 viewBox), e.g. from simple-icons. */
  stack: { name: string; icon: string }[];
  seo: { title: string; description: string; ogImage: string };
}

export const site: SiteConfig = {
  name: 'Your Name', // TODO: your full name
  role: 'Full-stack developer',
  studentLine: 'Information Technology student',
  status: 'Open to internships & junior roles · Graduating 20XX', // TODO: your graduation year
  graduationYear: '20XX', // TODO
  location: 'City, Country', // TODO
  // TODO: 2–3 honest sentences in your own voice — what you build, what you're learning, what you want next.
  bio: "I'm an Information Technology student who builds full-stack web apps — from database tables and APIs to the interface people actually click. I learn by shipping small, real projects, and I'm looking for an internship or junior role where I can keep growing with a good team.",
  email: 'you@example.com', // TODO
  socials: {
    github: 'https://github.com/your-username', // TODO
    linkedin: 'https://www.linkedin.com/in/your-username', // TODO
  },
  cvPath: '/cv.pdf', // TODO: replace public/cv.pdf with your real CV
  // photo,
  // TODO: list the tools you actually use, most confident first.
  stack: [
    { name: 'Laravel', icon: siLaravel.path },
    { name: 'PHP', icon: siPhp.path },
    { name: 'JavaScript', icon: siJavascript.path },
    { name: 'TypeScript', icon: siTypescript.path },
    { name: 'React', icon: siReact.path },
    { name: 'Tailwind CSS', icon: siTailwindcss.path },
    { name: 'MySQL', icon: siMysql.path },
    { name: 'Git', icon: siGit.path },
  ],
  seo: {
    title: 'Your Name — Full-stack developer & IT student', // TODO
    description:
      'Portfolio of Your Name, an Information Technology student building full-stack web apps. Open to internships and junior roles.', // TODO
    ogImage: '/og.png',
  },
};
