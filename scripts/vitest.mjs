// Runs Vitest from a path with an uppercase drive letter. Usage: node scripts/vitest.mjs [vitest args]
// On Windows, a terminal opened at "c:\..." loads Vitest twice ("c:" and "C:"), the copies don't share
// state, and every test fails with "Cannot read properties of undefined (reading 'config')".
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const cwd = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
const bin = join(cwd, 'node_modules', 'vitest', 'vitest.mjs');
const { status } = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], { cwd, stdio: 'inherit' });
process.exit(status ?? 1);
