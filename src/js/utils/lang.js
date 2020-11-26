const VOWELS = { 'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1, 'æ': 1 };

/**
 * Is the character a vowel?
 * @param {String} char 
 * @returns {Boolean}
 */
export function isVowel(char) {
    return char in VOWELS;
}

/**
 * Returns an array of clusters of vowels or consonants from the given string.
 * @param {String} str 
 * @returns {Array}
 */
export function toClusters(str) {
    const arr = [];
    let s = '';
    for (let i = 0; i < str.length; i++) {
        if (s && s.substr(-1) in VOWELS !== str[i] in VOWELS) {
            arr.push(s);
            s = str[i];
        } else {
            s += str[i];
        }
    }
    arr.push(s);
    return arr;
}

export const rules = {
    "double-vowels-to-single-vowel": {
        "regex": "([aeiou])\\1",
        "repl": "$1"
    },
    "short-vowels-vanished-before-morpheme-boundaries": {
        "regex": "(\\B[aeiou][^aeiou])[aeiou]([^aeiou][aeiou]\\B)",
        "repl": "$1$2"
    },
    "short-i-u-became-e-o-preceding-final-a": {
        "regex": "(?<=[^aeiou])([iu])(?=[^aeiou]+a$)",
        "repl": {
            "i": "e",
            "u": "o"
        }
    },
    "short-u-became-o": {
        "regex": "([^aeiou]|^)u([^aeiou]+\\B)",
        "repl": "$1o$2"
    },
    "short-e-o-became-i-u-in-syllable-before-final-i": {
        "regex": "(?<=[^aeiou])[eo](?=[^aeiou]+i$)",
        "repl": {
            "e": "i",
            "o": "u"
        }
    },
    "not-silent-final-e": {
        "regex": "e$",
        "repl": "ë"
    },
    "add-circumflex-to-vowel-in-next-to-last-syllable": {
        "regex": "[aeiou](?=[^aeiou]+[aeiou]+[^aeiou]?$)",
        "repl": {
            "a": "â",
            "e": "ê",
            "i": "î",
            "o": "ô",
            "u": "û"
        }
    },
    "add-circumflex-to-vowel-in-last-syllable": {
        "regex": "[aeiou](?=[^aeiou]*$)",
        "repl": {
            "a": "â",
            "e": "ê",
            "i": "î",
            "o": "ô",
            "u": "û"
        }
    },
    "acute-accent-to-vowel-in-last-syllable-ending-in-consonant": {
        "regex": "[aeiou](?=[^aeiou]+$)",
        "repl": {
            "a": "á",
            "e": "é",
            "i": "í",
            "o": "ó",
            "u": "ú"
        }
    },
    "acute-accent-to-vowel-in-next-to-last-syllable": {
        "regex": "[aeiou](?=[^aeiou]+[aeiouá-ú]+[^aeiou]?$)",
        "repl": {
            "a": "á",
            "e": "é",
            "i": "í",
            "o": "ó",
            "u": "ú"
        }
    }
};