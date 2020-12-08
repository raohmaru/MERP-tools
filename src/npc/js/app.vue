<template>
    <form action="" @submit.prevent="generate">
        <fieldset>
            <Name ref="name" v-model="name"/>
        </fieldset>

        <fieldset>
            <Combobox ref="gender" id="npc-gender" title="Género"
                        :data="data.genders"
                        v-model="gender"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="prof" id="npc-prof" title="Profesión"
                        :data="data.professions"
                        v-model="prof"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="job" id="npc-job" title="Oficio" :show-enable="true" :enabled="false"
                        :data="data.jobs"
                        v-model="job"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="race" id="npc-race" title="Raza"
                        :data="data.races"
                        v-model="race"/>
        </fieldset>
        
        <fieldset>
            <RangeNumeric ref="level" id="npc-level" title="Nivel" :min="1" :max="levelMax"
                    :range="false"
                    v-model="level"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="atk1" id="npc-atk1" title="Ataque principal"
                        :data="data.attacks"
                        v-model="atk1"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="atk2" id="npc-atk2" title="Ataque secundario"
                        :data="data.attacks"
                        v-model="atk2"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="armor" id="npc-armor" title="Armadura" random-label="Profesional"
                        :data="data.armor"
                        v-model="armor"/>
        </fieldset>

        <fieldset>
            <input type="checkbox" value="shield" id="npc-shield"
                    v-model="shield">
            <label for="npc-shield">Escudo</label>
            <input type="checkbox" value="magic" id="npc-magicdef"
                    v-model="shield">
            <label for="npc-magicdef">Defensa mágica</label>
        </fieldset>
        
        <fieldset>
            <Slider ref="variation" id="npc-variation" title="Variación"
                    :min="0" :max="100" :step="1"
                    v-model="variation"/>
        </fieldset>

        <input type="submit" value="Generar"> <!-- <input type="number" name="qty"> -->
    </form>

    <article>
        <p class="center">
            <strong>{{ name }}</strong> ({{ npc.race?.label }}<span v-if="npc.gender?.id !== 'nd'">, {{ npc.gender?.label }}</span>)
        </p>
        
        <section>
            <Stats ref="stats" :data="data.stats" :level-max="levelMax"
                    :variation="variation" :shield="shield"/>
        </section>
        
        <section>
            Rasgos de interpretación
            <ul>
                <li>Personalidad</li>
                <li>Motivación</li>
                <!-- https://en.wikipedia.org/wiki/Alignment_(Dungeons_%26_Dragons) -->
                <li>Alineamiento</li>
            </ul>
        </section>
    
        <section>
            Conducta
            <ul>
                <li>Alineamiento: +0</li>
                <li>Honestidad: +0</li>
                <li>Dominante: +0</li>
            </ul>
        </section>
    
        <section>
            <!-- https://springhole.net/writing_roleplaying_randomators/basic-character-appearance.htm -->
            Apariencia física
            <ul>
                <li>Piel</li>
                <li>Cabello</li>
                <li>Ojos</li>
                <li>Altura</li>
                <li>Peso</li>
                <li>Complexión</li>
            </ul>
        </section>
    </article>
</template>

<script>
import * as components from './components/index.js';
import { computed } from 'vue';

export default {
    components,
    
    data() {
        return {
            data: {},
            name: '',
            gender: 'random',
            genderLabel: '',
            prof: 'warrior',
            job: 'random',
            race: 'beorning',
            raceLabel: '',
            atk1: 'random',
            atk2: 'random',
            armor: 'random',
            level: [1, 10],
            levelMax: 20,
            shield: [],
            variation: 0,
            items: [],
            npc: {}
        };
    },
    
    provide() {
        return {
            // Data available for components and makes them reactive
            items: computed(() => this.items),
            defs: computed(() => this.data.defs),
            npc: computed(() => this.npc)
        }
    },

    mounted() {
        this.loadData();
    },

    watch: {
        shield(newValue, oldValue) {
            if (newValue.includes('shield') && !oldValue.includes('shield')) {
                this.addItem('shield');
            } else if (!newValue.includes('shield') && oldValue.includes('shield')) {
                this.removeItem('shield');
            }
        },

        armor(newValue) {
            this.applyItem('armor', newValue);
        }
    },

    methods: {
        async loadData() {
            const data = await fetch('data/npc.json');
            const res = await data.json();
            this.data = Object.assign({}, res);
        },

        async generate() {
            const comps = this.$refs;
            this.npc = {
                gender: comps.gender.getValue(),
                race: comps.race.getValue(),
                prof: comps.prof.getValue(),
                job: comps.job.getValue(),
                atk1: comps.atk1.getValue(),
                atk2: comps.atk2.getValue(),
                level: comps.level.getValue()
            };
            comps.stats.fill();
            comps.name.generateName(this.npc.race.id, this.npc.gender.id);
            this.applyItem('armor', this.armor);
        },

        applyItem(id, value) {
            const stats = this.$refs.stats;
            if (value !== 'random') {
                stats.setStat(id, value);
            } else {
                stats.resetStat(id);
            }
            this.removeItem(id);
            this.addItem(id, stats.getStat(id));
        },

        addItem(id, model) {
            const item = this.data.defs.items[model || id];
            // Injected properties does now triggers a change unless they are replaced
            this.items = [...this.items, {
                ...item,
                id
            }];
        },

        removeItem(id) {
            this.items = this.items.filter(it => it.id !== id);
        },

        getItem(id) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id === id) {
                    return this.items[i];
                }
            }
            return {};
        }
    }
};
</script>