const fs = require('fs');

const files = [
  'c:\\Users\\Wesley\\Documents\\gastos\\src\\components\\three\\scene-view.tsx',
  'c:\\Users\\Wesley\\Documents\\gastos\\src\\components\\three\\mood-emoji.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, 'utf8');
    const originalLength = data.length;
    data = data.split('\n').filter(line => !line.includes('营销')).join('\n');
    fs.writeFileSync(file, data);
    console.log(`Cleaned ${file}: ${originalLength} -> ${data.length}`);
  }
});
