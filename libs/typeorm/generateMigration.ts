import { execSync } from 'child_process';

const [, , name] = process.argv;

execSync(
  `npx typeorm-ts-node-esm -d ./src/index.ts migration:generate ./src/migrations/${name}`,
  { stdio: 'inherit' },
);
