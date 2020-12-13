<template>
    <ul>
        <li>{{ $t('personality') }}: {{ personality.map($t).join(', ') }}</li>
        <li>{{ $t('motivation') }}: {{ motivation }} </li>
        <!-- https://en.wikipedia.org/wiki/Alignment_(Dungeons_%26_Dragons) -->
        <li>{{ $t('alignment') }}</li>
    </ul>
</template>

<script>
/*
https://tvtropes.org/pmwiki/pmwiki.php/Main/MotivationIndex
https://www.ashami.com/rpg/
https://docs.google.com/document/d/1IzXECpMmCBYQ00fAiBzlxDpJZCVyF_YkqLQ01__PEyw/edit?usp=sharing
https://springhole.net/writing_roleplaying_randomators/character-motivation.htm

Acceptance - the need to be appreciated
Curiosity - the need to gain knowledge
Family - the need to take care of one’s offspring
Honor - the need to be faithful to the customary values of an individual’s ethnic group, family or clan
Idealism - the need for social justice
Independence - the need to be distinct and self-reliant
Order - the need for prepared, established, and conventional environments
Power - the need for control of will
Romance - the need for mating or sex
Saving - the need to accumulate something
Social contact - the need for relationship with others
Social status - the need for social significance
Tranquility - the need to be secure and protected
Vengeance - the need to strike back 
*/
import { randomInt, sample } from '@utils/random.js';
import { fillRange } from '@utils/array.js';

export default {
    props: ['data', 'amount'],

    data() {
        return {
            personality: [],
            motivation: ''
        };
    },

    methods: {
        generate() {
            this.genPersonality();
            this.genMotivation();
        },

        genPersonality() {
            const persData = this.data.personality;
            const types = Object.keys(persData);
            const arr = [];
            let idxs = fillRange(persData.pos.length);
            for (let i = 0; i < this.amount; i++) {
                const t = sample(types);
                const n = randomInt(idxs.length);
                arr.push(sample(persData[t][n]));
                idxs.splice(idxs.indexOf(n), 1); // remove trait index so it's not repeated
            }
            this.personality = arr;
        },

        genMotivation() {
            const motiv = this.parse(sample(this.data.motivation.primary));
            this.motivation = motiv.map(v => this.$i18n.t(v)).join(' ');
        },

        parse(str) {
            const terms = this.data.motivation.terms;
            const regex = /<([^>]+)>/;
            const parts = [];
            let m;
            while (m = str.match(regex)) {
                const term = sample(terms[m[1]]);
                parts.push(str.substring(0, m.index).trim());
                str = str.substring(m.index + m[0].length);
                if (regex.test(term)) {
                    str = term + str;
                } else {
                    parts.push(term);
                }
            }
            parts.push(str.trim());
            return parts.filter(String);
        }
    }
};
</script>
