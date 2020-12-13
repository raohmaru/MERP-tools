<template>
    <LocaleSelector/>

    <form action="" @submit.prevent="generate">
        <fieldset>
            <Name ref="name" v-model="name"/>
        </fieldset>

        <fieldset>
            <Combobox ref="gender" id="npc-gender" title="gender"
                        :data="data.genders"
                        v-model="gender"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="prof" id="npc-prof" title="profession"
                        :data="data.professions"
                        v-model="prof"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="job" id="npc-job" title="job" :show-enable="true" :enabled="false" :sort="true"
                      :data="data.jobs"
                      v-model="job"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="race" id="npc-race" title="culture_race"
                        :data="data.races"
                        v-model="race"/>
        </fieldset>
        
        <fieldset>
            <RangeNumeric ref="level" id="npc-level" title="level" :min="1" :max="levelMax"
                    :range="false"
                    v-model="level"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="atk1" id="npc-atk1" title="atk1" group="attacks" :sort="true"
                        :data="data.attacks"
                        v-model="atk1"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="atk2" id="npc-atk2" title="atk2" group="attacks" :sort="true"
                        :data="data.attacks"
                        v-model="atk2"/>
        </fieldset>
        
        <fieldset>
            <Combobox ref="armor" id="npc-armor" title="armor" random-label="professional" group="armors"
                        :data="data.armor"
                        v-model="armor"/>
        </fieldset>

        <fieldset>
            <input type="checkbox" value="shield" id="npc-shield"
                    v-model="shield">
            <label for="npc-shield">{{ $t('shield') }}</label>
            <input type="checkbox" value="magic" id="npc-magicdef"
                    v-model="shield">
            <label for="npc-magicdef">{{ $t('magicdef') }}</label>
        </fieldset>
        
        <fieldset>
            <Slider ref="variation" id="npc-variation" title="variation"
                    :min="0" :max="100" :step="1"
                    v-model="variation"/>
        </fieldset>

        <input type="submit" :value="$t('generate')">
    </form>

    <article>
        <p class="center">
            <strong>{{ name }}</strong> ({{ $t(npc.race || '') }}<span v-if="npc.gender !== 'not-defined'">, {{ $t(npc.gender || '') }}</span>)
        </p>
        
        <section>
            <Stats ref="stats" :data="data.stats" :level-max="levelMax"
                   :variation="variation" :shield="shield"/>
        </section>
        
        <section>
            {{ $t('role_traits') }}
            <RoleTraits ref="roletraits" amount="3" :data="data.traits"/>
        </section>
    
        <section>
            {{ $t('demeanor') }}
            <ul>
                <!-- Based on a lecture by Chris Crawford -->
                <li>{{ $t('goodness') }}: +0</li>
                <li>{{ $t('honesty') }}: +0</li>
                <li>{{ $t('dominant') }}: +0</li>
            </ul>
        </section>
    
        <section>
            <!-- https://springhole.net/writing_roleplaying_randomators/basic-character-appearance.htm -->
            {{ $t('phys_appearance') }}
            <ul>
                <li>{{ $t('skin') }}</li>
                <li>{{ $t('hair') }}</li>
                <li>{{ $t('eyes') }}</li>
                <li>{{ $t('height') }}</li>
                <li>{{ $t('weight') }}</li>
                <li>{{ $t('build') }}</li>
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
            prof: 'random',
            job: 'random',
            race: 'random',
            atk1: 'random',
            atk2: 'random',
            armor: 'random',
            level: [1, 10],
            levelMax: 20,
            shield: [],
            variation: 5,
            npc: {}
        };
    },
    
    provide() {
        return {
            // Data available for components and makes them reactive
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
                this.$items.add('shield');
            } else if (!newValue.includes('shield') && oldValue.includes('shield')) {
                this.$items.remove('shield');
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
            this.$items.setup(this.data.defs.items);
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
            comps.name.generateName(this.npc.race, this.npc.gender);
            comps.roletraits.generate();
            this.applyItem('armor', this.armor);
        },

        applyItem(id, value) {
            const stats = this.$refs.stats;
            if (value !== 'random') {
                stats.setStat(id, value);
            } else {
                stats.resetStat(id);
            }
            this.$items.remove(id);
            this.$items.add(id, stats.getStat(id));
        }
    }
};
</script>