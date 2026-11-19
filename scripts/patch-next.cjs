const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'lib', 'has-necessary-dependencies.js');

if (!fs.existsSync(targetFile)) {
  console.log('has-necessary-dependencies.js not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(targetFile, 'utf8');

const original = 'const pkgPath = await _fs.promises.realpath((0, _resolvefrom.resolveFrom)(baseDir, `${p.pkg}/package.json`));';

const patched = `const rawPath = (0, _resolvefrom.resolveFrom)(baseDir, \`\${p.pkg}/package.json\`);
            let pkgPath;
            try {
                pkgPath = await _fs.promises.realpath(rawPath);
            } catch {
                try {
                    pkgPath = _fs.realpathSync(rawPath);
                } catch {
                    pkgPath = rawPath;
                }
            }`;

if (content.includes(original)) {
  content = content.replace(original, patched);
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully applied Windows OneDrive realpath patch to Next.js has-necessary-dependencies.js');
} else {
  console.log('Next.js has-necessary-dependencies.js is already patched or up-to-date.');
}
