<template>
    <label for="npc-name">Nombre</label>
    <input type="text" name="name" id="npc-name"
            v-model="name"
            :disabled="random">
    <input type="checkbox" id="npc-name-random"
            v-model="random">
    <label for="npc-name-random">Aleatorio</label>
</template>

<script>
import generateName from '@utils/name-generator.js'

const nameSetCache = {};
const raceLangs = {
    'umli': 'umitic',
    'wose': 'drughic',
    'hobbit': 'westron',
    'dwarf': 'khuzdul',
    'noldor': 'quenya',
    'silvan': 'sindarin',
    'sindar': 'sindarin',
    'half-elven': 'quenya',
    'dunadan': 'sindarin',
    'beorning': 'atliduk',
    'corsair': 'adunaic',
    'dorwinadan': 'folyavultig',
    'dunlending': 'dunlending',
    'eriadorian': 'westron',
    'gondorian': 'sindarin-gondorian',
    'haradan': 'haradaic',
    'woodmen': 'rhovanian',
    'easterling': 'womaw',
    'lossadan': 'labba',
    'numenorean': 'adunaic',
    'rohir': 'rohirric',
    'variag': 'varadja',
    'half-orc': 'orkish',
    'half-troll': 'morbeth',
    'olog-hai': 'morbeth',
    'orc': 'orkish',
    'troll': 'morbeth',
    'uruk-hai': 'morbeth'
};
const defaultLang = 'westron';

export default {
    data() {
        return {
            name: '',
            random: true
        }
    },

    methods: {
        async getName(race, gender) {
            if (!this.random) {
                return this.name;
            }

            const lang = raceLangs[race] || defaultLang;
            let data;
            if (nameSetCache[lang]) {
                data = nameSetCache[lang];
            } else {
                let res = await fetch(`data/names/${lang}.json`);
                if (!res.ok) {
                    return '';
                }
                res = await res.json();
                data = res;
                nameSetCache[lang] = data;
            }
            return generateName(data, lang, gender);
        }
    }
};
</script>
