const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content
    // Revert Select
    .replace(/@\/components\/ui\/select/g, '@/components/ui/Select')
    // Revert Breadcrumbs
    .replace(/@\/components\/ui\/breadcrumbs/g, '@/components/ui/Breadcrumbs')
    // Revert Input
    .replace(/@\/components\/ui\/input/g, '@/components/ui/Input')
    // Revert Button
    .replace(/@\/components\/ui\/button/g, '@/components/ui/Button');
    
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Reverted imports in ' + f);
  }
});
