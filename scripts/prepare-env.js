const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.ts');
const aiApiKey = process.env['AI_API_KEY'];

if (!aiApiKey) {
  console.warn('[prepare-env] AI_API_KEY not set, keeping placeholder.');
  process.exit(0);
}

let content = fs.readFileSync(envFile, 'utf-8');
content = content.replace(/aiApiKey:\s*'[^']*'/, `aiApiKey: '${aiApiKey}'`);
fs.writeFileSync(envFile, content, 'utf-8');
console.log('[prepare-env] Injected AI_API_KEY into environment.ts');
