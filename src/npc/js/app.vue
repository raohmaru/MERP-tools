<script>
import { Name, Combobox } from './components/index.js';

export default {
    components: {
        Name,
        Combobox
    },
    
    data() {
        return {
            data: {},
            gender: 'random',
            prof: 'random',
            job: 'random',
            race: 'random',
            atk1: 'random',
            atk2: 'random',
            npc: {
                name: '',
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
            },
            randomLevel: false,
            levelStart: 1,
            levelEnd: 1,
            variation: 5
        };
    },

    mounted() {
        this.loadData();
    },

    watch: {
        levelStart(newValue, oldValue) {
            this.levelEnd = Math.max(this.levelEnd, newValue);
        }
    },

    methods: {
        async loadData() {
            const data = await fetch('data/form.json');
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
        }
    }
};
</script>
