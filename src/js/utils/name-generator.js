// https://www.fantasynamegenerators.com/lord-of-the-rings.php
// https://eldamo.org/content/languages/index.html

import createChain from './markov-chain.js';
import { createString, applyRule } from './markov-string.js';

const chainCache = {};

export default function (data, lang, gender) {
    let chain = chainCache[lang];
    if (!chain) {
        chain = createChain(data);
        chainCache[lang] = chain;
        // console.log(chain);
    }
    
    let name = createString(chain);

    if (chain.gender) {
        chain.gender.forEach(rule => {
            if (rule.type === gender) {
                name = applyRule(rule, name);
            }
        });
    }

    if (chain.diacritics) {
        chain.diacritics.forEach(rule => {
            name = applyRule(rule, name);
        });
    }

    return name;
}