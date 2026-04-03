const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.ts');
const groqApiKey = process.env['GROQ_API_KEY'];

if (!groqApiKey) {
  console.warn('[prepare-env] GROQ_API_KEY not set, keeping placeholder.');
  process.exit(0);
}

let content = fs.readFileSync(envFile, 'utf-8');
content = content.replace(/groqApiKey:\s*'[^']*'/, `groqApiKey: '${groqApiKey}'`);
fs.writeFileSync(envFile, content, 'utf-8');
console.log('[prepare-env] Injected GROQ_API_KEY into environment.ts');
