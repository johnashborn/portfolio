import type { ImageMetadata } from 'astro';
import { siGit, siJavascript, siLaravel, siMysql, siPhp, siTailwindcss } from 'simple-icons';
// Your photo (src/assets/photo.jpg). Shown in the hero, cropped to 4:5.
import photo from './assets/photo.jpg';

export interface SiteConfig {
  name: string;
  role: string;
  studentLine: string;
  status: string;
  graduationYear: string;
  location: string;
  bio: string;
  email: string;
  /** Completes "I usually reply …" — only promise what you can keep. */
  replyTime: string;
  socials: { github: string; linkedin: string };
  cvPath: string;
  photo?: ImageMetadata;
  /** `icon` is an SVG path (24×24 viewBox), e.g. from simple-icons. */
  stack: { name: string; icon: string }[];
  seo: { title: string; description: string; ogImage: string };
}

export const site: SiteConfig = {
  name: 'John Rey B. Aranton',
  role: 'Aspiring Full-stack developer and Aspiring AI automation Specialist',
  studentLine: 'Information Technology student',
  status: 'Open to internships & junior roles · Graduating 2028',
  graduationYear: '2028',
  location: 'Tagbilaran City, Philippines',
  // Draft bio — rewrite it in your own voice (2–3 sentences: what you build, what you're learning, what you want next).
  bio: "I build full-stack web apps — from database tables and APIs to the interface people actually click. I learn by shipping small, real projects, and I'm looking for an internship or junior role where I can keep growing with a good team.",
  email: 'arantonjohnrey075@gmail.com',
  replyTime: 'within 1-3 days',
  socials: {
    github: 'https://github.com/johnashborn',
    linkedin: 'https://www.linkedin.com/in/johnreyaranton',
  },
  cvPath: '/cv.pdf',
  photo,
  // The tools you actually use, most confident first.
  stack: [
    { name: 'Laravel', icon: siLaravel.path },
    { name: 'PHP', icon: siPhp.path },
    { name: 'JavaScript', icon: siJavascript.path },
    { name: 'Tailwind CSS', icon: siTailwindcss.path },
    { name: 'MySQL', icon: siMysql.path },
    { name: 'Git', icon: siGit.path },
  ],
  seo: {
    title: 'John Rey B. Aranton — Full-stack developer & IT student',
    description:
      'John Rey B. Aranton, an Information Technology student building full-stack web apps. Open to internships and junior roles.',
    ogImage: '/og.png',
  },
};
