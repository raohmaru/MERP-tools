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
            prof: 'warrior',
            job: 'random',
            race: 'beorning',
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
            defs: computed(() => this.data.defs)
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
            const npc = {};
            npc.gender = comps.gender.getValue();
            npc.race   = comps.race.getValue();
            comps.name.getName(npc.race.id, npc.gender.id);
            npc.prof   = comps.prof.getValue();
            npc.job    = comps.job.getValue();
            npc.atk1   = comps.atk1.getValue();
            npc.atk2   = comps.atk2.getValue();
            npc.level  = comps.level.getValue();
            this.npc = npc;

            comps.stats.fill(npc);
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