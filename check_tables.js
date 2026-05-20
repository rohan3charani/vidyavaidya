const fs = require('fs');
const content = fs.readFileSync('d:/vidyavaidya/src/pages/admin/CmsComponents.jsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('Established')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
  if (line.includes('Actions')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
