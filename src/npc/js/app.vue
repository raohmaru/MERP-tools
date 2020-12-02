<script>
import * as components from './components/index.js';
import { computed } from 'vue';

export default {
    components,
    
    data() {
        return {
            data: {},
            gender: 'random',
            prof: 'warrior',
            job: 'random',
            race: 'haradan',
            atk1: 'random',
            atk2: 'random',
            level: [1, 10],
            levelMax: 20,
            shield: [],
            variation: 5,
            items: [],
            npc: {
                name: '',
                level: null,
                gender: {
                    id: 'nd',
                    label: ''
                },
                prof: {
                    id: '',
                    label: ''
                },
                job: {
                    id: '',
                    label: ''
                },
                race: {
                    id: '',
                    label: ''
                },
                atk1: {
                    id: '',
                    label: ''
                },
                atk2: {
                    id: '',
                    label: ''
                }
            }
        };
    },
    
    provide() {
        return {
            // Data available for components and makes them reactive
            items: computed(() => this.items)
        }
    },

    mounted() {
        this.loadData();
    },

    watch: {
        shield(newValue, oldValue) {
            if (newValue.includes('shield') && !oldValue.includes('shield')) {
                // Injected properties does now triggers a change unless they are replaced
                this.items = [...this.items, {
                    name: 'Escudo',
                    bonus: 25,
                    mod: 'bd'
                }];
            } else if (!newValue.includes('shield') && oldValue.includes('shield')) {
                this.items = this.items.filter(it => it.name !== 'Escudo');
            }
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
            const npc = this.npc;
            npc.gender = comps.gender.getValue();
            npc.race   = comps.race.getValue();
            npc.name   = await comps.name.getName(npc.race.id, npc.gender.id);
            npc.prof   = comps.prof.getValue();
            npc.job    = comps.job.getValue();
            npc.atk1   = comps.atk1.getValue();
            npc.atk2   = comps.atk2.getValue();
            npc.level  = comps.level.getValue();

            comps.stats.fill();
        }
    }
};
</script>