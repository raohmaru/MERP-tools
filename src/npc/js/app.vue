<script>
import Name from './components/name.vue';

export default {
    components: {
        Name
    },
    
    data() {
        return {
            data: {},
            npc: {},
            randomLevel: false,
            addJob: true,
            levelStart: 1,
            levelEnd: 1,
            variation: 5,
            name
        };
    },

    mounted() {
        this.loadData();
    },

    computed: {
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
            const { getName } = this.$refs.name;
            const race = this.$refs.npcRace.value;
            let name;
            for (let index = 0; index < 100; index++) {
                name = await getName(race);
                console.log(name);
            }
            this.npc.name = name;
        }
    }
};
</script>
