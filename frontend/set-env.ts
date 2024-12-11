import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import yargs from 'yargs';

dotenv.config();

const argv = yargs(process.argv.slice(2)).argv as { [key: string]: unknown; environment?: string };
const environment = (argv.environment as string) || 'development';
const isProduction = environment === 'production';

const targetPath = isProduction
  ? './src/environments/environment.ts'
  : './src/environments/environment.development.ts';

const envConfigFile = `export const environment = {
  production: ${isProduction},
  api_url: '${process.env["ApiUrl"]}'
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
