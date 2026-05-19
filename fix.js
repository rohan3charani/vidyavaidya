
const fs = require('fs');
const file = 'd:/project/vidyavaidya/src/pages/admin/CmsComponents.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make authorName optional in schema
content = content.replace(
  'authorName: z.string().min(2, { message: \
Author
name
must
be
at
least
2
characters\ }),',
  'authorName: z.string().optional().default(\Vidyavaidya
Board\),'
);

// 2. Remove Section 2 and 3
const section2And3Regex = /\{\/\* 2\. Article Content Section \*\/\}.*?\{\/\* 4\. Media Uploads Section \*\/\}/s;
content = content.replace(section2And3Regex, '{/* 4. Media Uploads Section */}');

// 3. Remove Gallery/Video fields from Section 4
const galleryVideoRegex = /\{selectedType === \gallery_photo\.*?\n\s+\}\)\}\n\s+<\/div>\n\s+<\/div>/s;
content = content.replace(galleryVideoRegex, '</div>\n                </div>');

// 4. Remove Section 5 and 6
const section5And6Regex = /\{\/\* 5\. SEO \/ Tags Section \*\/\}.*?\{\/\* Sticky Footer Actions \*\/\}/s;
content = content.replace(section5And6Regex, '{/* Sticky Footer Actions */}');

fs.writeFileSync(file, content);
console.log('Successfully updated CmsComponents.jsx');

