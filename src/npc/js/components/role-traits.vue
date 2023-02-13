<template>
    <ul>
        <li>
            {{ $t('personality') }}: {{ personality.map($t).join(', ') }}
            <span @click="genPersonality">🔃</span>
        </li>
        <li>
            {{ $t('motivation') }}: {{ motivation.map($t).join(' ') }}
            <span @click="genMotivation">🔃</span>
        </li>
        <li>
            {{ $t('alignment') }} <a href="https://en.wikipedia.org/wiki/Alignment_(Dungeons_%26_Dragons)#Alignments" target="_blank" title="Explanation">[ℹ]</a>:
                {{  $t(ethical) }} / {{  $t(moral) }}
            <span @click="genAlignment">🔃</span>
        </li>
    </ul>
    {{ $t('demeanor') }} <span @click="genDemeanor">🔃</span>
    <ul>
        <!-- Based on a lecture by Chris Crawford -->
        <li>{{ $t('goodness') }}: {{ goodness }}%</li>
        <li>{{ $t('honesty') }}: {{ honesty }}%</li>
        <li>{{ $t('dominant') }}: {{ dominant }}%</li>
    </ul>
</template>

<script>
// https://www.ashami.com/rpg/

import { randomInt, sample } from '@utils/random.js';
import { fillRange } from '@utils/array.js';

export default {
    props: ['data', 'amount'],

    data() {
        return {
            personality: [],
            motivation: [],
            moral: '',
            ethical: '',
            goodness: 0,
            honesty: 0,
            dominant: 0
        };
    },

    methods: {
        generate() {
            this.genPersonality();
            this.genMotivation();
            this.genAlignment();
            this.genDemeanor();
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
            this.motivation = this.parse(sample(this.data.motivation.primary));
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
        },

        genAlignment() {
            this.moral = sample(this.data.alignment.moral);
            this.ethical = sample(this.data.alignment.ethical);
        },

        genDemeanor() {
            this.goodness = randomInt(100);
            this.honesty = randomInt(100);
            this.dominant = randomInt(100);
        }
    }
};
</script>
