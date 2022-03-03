import civitek from 'scrapers/civitek';
import { readdir } from 'fs/promises';

console.log(await readdir('/opt'));
console.log(await readdir('/opt/nodejs'));
console.log(await readdir('/opt/puppeteer'));

console.log(civitek);

export async function handler(event, context) {
    //
}
