import * as  path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '../');

const projectRoot = PROJECT_ROOT;
const outputPath = path.join(PROJECT_ROOT, 'dist');
const appEntry = path.join(PROJECT_ROOT, 'src');
const tslint = path.join(PROJECT_ROOT, 'tslint.json');
const tsconfig = path.join(PROJECT_ROOT, 'tsconfig.json');
const faviconPath = path.join(PROJECT_ROOT, 'public/assets/favicon.png');

export { projectRoot, outputPath, appEntry, tslint, tsconfig, faviconPath };
