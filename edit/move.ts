import fse from 'fs-extra';
import fs from 'fs';

const args = process.argv.slice(2);
const path = args[0];

const tracker = fs.readFileSync(`${path}/tracker.json`);
fs.writeFileSync('sheets/tracker.json', tracker);
const creditsName = fs.readFileSync(`${path}/credit_names.txt`);
fs.writeFileSync('sheets/credit_names.txt', creditsName);
fse.copySync('sheets', '../app/public/dist/client/assets/pokemons', {overwrite: true});
