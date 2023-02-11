import { toClusters } from './lang.js';
import { sample } from '../../utils/random.js';

const WEIGHT_SCALE = 1.3;

/**
 * Scales the weight of the children of the given token in the chain and returns its total weight.
 * @param {Object} chain 
 * @param {String} key 
 * @returns {Number}
 */
function getWeight(chain, key) {
    if (!chain[key]) {
        return;
    }
    chain['weights'] ??= {};
    if (!chain['weights'][key]) {
        let w = 0;
        for (const [token, count] of Object.entries(chain[key])) {
            const weighted = Math.floor(count ** WEIGHT_SCALE);
            chain[key][token] = weighted;
            w += weighted;
        }
        chain['weights'][key] = w;
    }
    return chain['weights'][key];
}

/**
 * Gets the following token for the given token in the Markov model.
 * @param {Object} chain 
 * @param {String} key 
 * @returns {String}
 */
function getToken(chain, key, def = '') {
    const len = getWeight(chain, key);
    if (len) {
        const idx = Math.floor(Math.random() * len);
        let t = 0;
        for (const [token, count] of Object.entries(chain[key])) {
            t += count;
            if (idx < t) {
                return token;
            }
        }
    }
    return def;
}

/**
 * Apply a rule to transform the given string.
 * @param {Object} rule
 * @param {String} str
 * @returns {String}
 */
export function applyRule(rule, str) {
    const m = str.match(rule.regex);
    if (m) {
        if (!rule.prob || Math.random() < rule.prob) {
            // const oldname = str;
            if (typeof rule.repl === 'string') {
                str = str.replace(rule.regex, rule.repl);            
            } else {
                let repl;
                if (Array.isArray(rule.repl)) {
                    repl = sample(rule.repl);
                } else {
                    repl = rule.repl[m[0]] || rule.repl[m[1]];
                }
                repl = repl.replace('$1', m[1] || '');
                str = str.substring(0, m.index)
                       + repl
                       + str.substring(m.index + m[0].length);
            }
            // console.log(`-- ${oldname} --> ${str}`);
        }
    }
    return str;
}

/**
 * Normalizes a string according to the phonetic rules found in the set.
 * @param {String} str
 * @param {Object} chain 
 * @returns {String}
 */
function normalize(str, chain) {
    const matches = toClusters(str);
    const { clusters } = chain;
    // Replace clusters with allowed ones
    for (let i = matches.length - 1; i > -1; i--) {
        let cl = matches[i];
        if (cl.length > 1 && !(cl in clusters)) {
            // console.log('-- Invalid cluster', cl, str);
            while(cl = cl.substring(0, cl.length - 1)) {
                if (cl in clusters || cl.length === 1) {
                    matches[i] = cl;
                    break;
                }
            }
        }
    }
    // Allowed ending
    let ending  = matches[matches.length - 1];
    if (!(ending in chain.ending)) {
        let allowed = false;
        if (ending.length === 1 && matches[matches.length - 2]) {
            ending = matches[matches.length - 2].substr(-1) + ending;
            allowed = (ending in chain.ending);
        }
        if (!allowed) {
            // console.log('-- Invalid ending', ending, matches.join(''));
            matches.push(getToken(chain, 'ending'));
        }
    }

    let name = matches.join('');

    // Language rules
    if (chain.rules) {
        chain.rules.forEach(rule => {
            name = applyRule(rule, name);
        });
    }

    return name;
}

/**
 * Creates a random Markov string from the given chain.
 * @param {Object} chain 
 * @returns {String}
 */
export function createString(chain) {
    const parts = getToken(chain, 'parts');
    const names = [];
    let sep = getToken(chain, 'sep', ' ');
    for (let i = 0; i < parts; i++) {
        const length = parseInt(getToken(chain, 'length'), 10);
        let char = getToken(chain, 'initial');
        let name = char;
        let lastChar = char.substr(-1);
        while (name.length < length) {
            char = getToken(chain, lastChar);
            if (!char) {
                break;
            }
            name += char;
            lastChar = char;
        }
        names.push(name);
    }

    if (names.length > 1 && chain.infixes && Math.random() < chain.infixes.prob) {
        sep = sample(chain.infixes.list);
    }

    let name = names
        .map(n => normalize(n, chain))
        .map(n => n[0].toUpperCase() + n.substring(1))
        .join(sep);

    return name;
}