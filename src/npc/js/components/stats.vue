<template>
    <table>
        <thead>
            <tr>
                <th>{{ $t('profession') }}</th>
                <th><abbr :title="$t('level')">#</abbr></th>
                <th><abbr :title="$t('at_long')">{{ $t('at') }}</abbr></th>
                <th><abbr :title="$t('hp_long')">{{ $t('hp') }}</abbr></th>
                <th><abbr :title="$t('pp_long')">{{ $t('pp') }}</abbr></th>
                <th><abbr :title="$t('ob1_long')">{{ $t('ob1') }}</abbr></th>
                <th><abbr :title="$t('ob2_long')">{{ $t('ob2') }}</abbr></th>
                <th><abbr :title="$t('mm_long')">{{ $t('mm') }}</abbr></th>
                <th><abbr :title="$t('gs_long')">{{ $t('gs') }}</abbr></th>
                <th><abbr :title="$t('stalkhide_long')">{{ $t('stalkhide') }}</abbr></th>
                <th><abbr :title="$t('locktrap_long')">{{ $t('locktrap') }}</abbr></th>
                <th><abbr :title="$t('per_long')">{{ $t('per') }}</abbr></th>
                <th><abbr :title="$t('runes_long')">{{ $t('runes') }}</abbr>/<abbr :title="$t('use_long')">{{ $t('use') }}</abbr></th>
                <th><abbr :title="$t('spells_long')">{{ $t('spells') }}</abbr></th>
                <th><abbr :title="$t('craft_long')">{{ $t('craft') }}</abbr></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {{ $t(npc.value.prof || '') }}
                    <span v-if="npc.value.job">/ {{ $t(`jobs.${npc.value.job}` || '') }}</span>
                </td>
                <td>{{ npc.value.level }}</td>
                <td>
                    <abbr :title="$t(`armors.${stats.armor}`)">{{ $t(`abbr.${stats.armor}`) }}</abbr>
                    ({{ stats.bd }}<abbr :title="$t('shield') + ' (+' + $items.get('shield').bonus + ')'" v-if="shield.includes('shield')">{{ $t('shield_short') }}</abbr><abbr :title="$t('magicdef_incr')" v-if="shield.includes('magic')">*</abbr>)
                </td>
                <td>{{ stats.hp }}</td>
                <td>{{ stats.pp }}</td>
                <td>{{ stats.ob1 }}<abbr :title="$t(`attacks.${npc.value.atk1}`)">{{ $t(`abbr.${npc.value.atk1}`) }}</abbr></td>
                <td>{{ stats.ob2 }}<abbr :title="$t(`attacks.${npc.value.atk2}`)">{{ $t(`abbr.${npc.value.atk2}`) }}</abbr></td>
                <td>{{ stats.mm }}</td>
                <td>{{ stats.general }}</td>
                <td>{{ stats.ss1 }}</td>
                <td>{{ stats.ss2 }}</td>
                <td>{{ stats.per }}</td>
                <td>{{ stats.runes }}</td>
                <td>{{ stats.basespell }} ({{ stats.spelllist }})</td>
                <td>{{ stats.craft }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { watch } from 'vue';
import { bezier3 } from '@utils/math.js';
import { random } from '@utils/random.js';

function bezier(t, points) {
    const x = bezier3(t, ...points.x);
    return bezier3(x, ...points.y);
}

export default {
    data() {
        return {
            stats: {},
            baseStats: {}
        }
    },
    props: ['data', 'levelMax', 'variation', 'shield'],
    inject: ['defs', 'npc'],
    methods: {
        /**
         * @param {String} name
         * @param {(Object|Number[])} stat
         */
        getStatValue(name, stat) {
            if (stat instanceof Array) {
                // stat = [min, max, px, py, cap]
                const range = stat[1] - stat[0];
                let v;
                if (stat.length <= 2) {
                    v = stat[0];
                } else {
                    const points = {
                        x: [0, stat[2], 1],
                        y: [0, stat[3], 1]
                    };
                    v = bezier(this.npc.value.level / this.levelMax, points) * range + stat[0];
                }

                if (this.variation) {
                    v += range * random(-1, 1) * (this.variation / 100);
                }

                const raceStats = this.defs.value.races[this.npc.value.race];
                if (raceStats) {
                    const raceStat = raceStats.stats[name];
                    if (raceStat && typeof raceStat === 'number') {
                        v += raceStat;
                    }
                }

                const statDef = this.defs.value.stats[name];
                if (v < 0 && statDef?.neg === false) {
                    v = statDef.min || 0;
                }

                return Math.round(v);
            } else {
                let v;
                for (const [key, value] of Object.entries(stat)) {
                    if (key > this.npc.value.level) {
                        break;
                    }
                    v = value;
                }
                return v;
            }
        },

        fill() {
            const perc = this.npc.value.level / this.levelMax;
            const stats = this.data[this.npc.value.prof];
            Object.keys(stats).forEach(n => {
                let v = this.getStatValue(n, stats[n]);
                this.baseStats[n] = v;
                this.stats[n] = v;
            });
        },

        applyItems() {
            if (!this.npc.value.race) {
                return;
            }
            const raceStats = this.defs.value.races[this.npc.value.race];
            const profStats = this.defs.value.professions[this.npc.value.prof].stats;
            this.$items.getAll().forEach(item => {
                let v = (this.baseStats[item.stat] || 0) + item.bonus;
                if (raceStats) {
                    const raceStat = raceStats.stats[item.stat];
                    if (raceStat && typeof raceStat !== 'number') {
                        for (const [key, value] of Object.entries(raceStat)) {
                            v += value[this.baseStats[key]];
                        }
                    }
                }
                if (profStats[item.stat]) {
                    for (const [key, value] of Object.entries(profStats[item.stat])) {
                        v += value[this.baseStats[key]];
                    }
                }
                this.stats[item.stat] = v;
            })
        },

        getStat(name) {
            return this.stats[name];
        },

        setStat(name, value) {
            this.baseStats[name] = value;
            delete this.stats[name];  // Force view re-render
            this.stats[name] = value;
        },

        resetStat(name) {
            if (this.npc.value.prof) {
                const v = this.getStatValue(name, this.data[this.npc.value.prof][name]);
                this.baseStats[name] = v;
                this.stats[name] = v;
            } else {
                delete this.baseStats[name];
                delete this.stats[name];
            }
        }
    },

    created() {
        // watch method of component doesn't seems to work with injected data
        watch(this.$items.items, (newValue, oldValue) => {
            oldValue.forEach(item => this.stats[item.stat] = this.baseStats[item.stat] || 0)
            this.applyItems();
        });
    }
};
</script>
