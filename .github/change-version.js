const fs = require('fs');

const data = fs.readFileSync("package.json")
let json = JSON.parse(data);
let version = process.argv[2];

json.version = version.replace('refs/tags/v', '');

fs.writeFileSync("package.json", JSON.stringify(json, null, 2));
