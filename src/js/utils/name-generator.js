// https://www.fantasynamegenerators.com/lord-of-the-rings.php
// https://eldamo.org/content/languages/index.html

import createChain from './markov-chain.js';
import createString from './markov-string.js';

const chainCache = {};

export default function (nameSet, set) {
    let chain = chainCache[nameSet];
    if (!chain) {
        chain = createChain(set);
        chainCache[nameSet] = chain;
        console.log(chain);
    }
    return createString(chain);
}