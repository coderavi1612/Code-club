const path = require('path');

const a = path.basename(__filename)
const b = path.dirname(__filename)
console.log(a);
console.log(b);

const c = path.extname(__filename)
console.log(c);
console.log(__filename);