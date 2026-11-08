import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

const DIST = join(process.cwd(), 'dist');

/** Load a built page from dist/ as a cheerio document. Routes: '/', '/404', '/projects/x/'. */
export function loadPage(route: string): cheerio.CheerioAPI {
  const clean = route.replace(/#.*$/, '').replace(/^\/+|\/+$/g, '');
  let file: string;
  if (clean === '') file = 'index.html';
  else if (clean === '404') file = '404.html';
  else file = join(clean, 'index.html');
  return cheerio.load(readFileSync(join(DIST, file), 'utf8'));
}
