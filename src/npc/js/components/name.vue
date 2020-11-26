<template>
    <div>
        <label for="npc-name">Nombre</label>
        <input type="text" name="name" id="npc-name"
                :disabled="randomName">
        <input type="checkbox" id="npc-name-random"
                v-model="randomName">
        <label for="npc-name-random">Aleatorio</label>
    </div>
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
            randomName: false
        }
    },

    methods: {
        async getName(nameSet) {
            let data;
            if (nameSet === 'random') {
                nameSet = defaultLang;
            } else if (raceLangs[nameSet]) {
                nameSet = raceLangs[nameSet];
            }
            if (nameSetCache[nameSet]) {
                data = nameSetCache[nameSet];
            } else {
                let res = await fetch(`data/names/${nameSet}.json`);
                if (!res.ok) {
                    return '';
                }
                res = await res.json();
                data = res;
                nameSetCache[nameSet] = data;
            }
            return generateName(nameSet, data);
        }
    }
};
</script>
