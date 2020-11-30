import { isVowel, toClusters, rulesPreset } from './lang.js';

/**
 * Name generator using markov chains.
 * Inspired by https://donjon.bin.sh/code/name/
 */

/**
 * Adds a new token to the chain and updates its weight.
 * @param {Object} chain 
 * @param {String} key 
 * @param {String} token
 * @returns {Object} - The chain object
 */
function addToChain(chain, key, token) {
    if (!chain[key]) {
        chain[key] = {};
    }
    if (chain[key][token]) {
        chain[key][token]++;
    } else {
        chain[key][token] = 1;
    }
    return chain;
}

/**
 * Process a rule object, parses the regex and it can inherit from a preset.
 * @param {Object} rules 
 * @returns {Array}
 */
function processRules(rules) {
    const arr = [];
    rules.forEach(o => {
        if (typeof o === 'string') {
            o = rulesPreset[o];
        } else if (o instanceof Array) {
            o = Object.assign({}, rulesPreset[o[0]], o[1]);
        }
        arr.push(Object.assign({}, o, {
            // Global flag does not add index to match()
            regex: new RegExp(o.regex, typeof o.repl === 'string' ? 'g' : '')
        }));
    });
    return arr;
}

/**
 * Construct markov chain from a list of strings.
 * @param {Array} list
 * @returns {Object}
 */
export default function createChain(set) {
    const { list, rules, infixes, parts, diacritics, gender } = set;
    const chain = { infixes, parts };
    for (let i = 0; i < list.length; i++) {
        const m = list[i].match(/[ \-]/);
        let sep = ' ';
        if (m) {
            addToChain(chain, 'sep', m[0]);
            sep = m[0];
        }
        const names = list[i].split(sep);
        addToChain(chain, 'parts', names.length);

        for (let j = 0; j < names.length; j++) {
            let name = names[j].toLowerCase();
            addToChain(chain, 'length', name.length);
            if (isVowel(name[0])) {
                addToChain(chain, 'initial', name[0]);
            }
            addToChain(chain, 'initial', name.substring(0, 2));
            const clusters = toClusters(name);
            clusters.forEach((cl, i) => {
                if (cl.length > 1) {
                    addToChain(chain, 'clusters', cl);
                }
                if (i === clusters.length - 1) {
                    if (clusters[i - 1] && !isVowel(cl[0])) {
                        cl = clusters[i - 1] + cl;
                    }
                    addToChain(chain, 'ending', cl);
                }
            });

            let lastChar;
            while (lastChar = name[0]) {
                name = name.substr(1);
                if (name.length) {
                    addToChain(chain, lastChar, name[0]);
                }
            }
        }
    }
    
    if (rules) {
        chain.rules = processRules(rules);
    }
    
    if (diacritics) {
        chain.diacritics = processRules(diacritics);
    }
    
    if (gender) {
        chain.gender = processRules(gender);
    }

    return chain;
}