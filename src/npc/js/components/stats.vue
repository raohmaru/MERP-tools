<template>
    <table>
        <thead>
            <tr>
                <th>Profesión</th>
                <th><abbr title="Nivel">#</abbr></th>
                <th><abbr title="Tipo de armadura (Bonificación defensiva)">TA (BD)</abbr></th>
                <th><abbr title="Puntos de vida">Pv</abbr></th>
                <th><abbr title="Puntos de poder">PP</abbr></th>
                <th><abbr title="Bonificación ofensiva con el arma principal">BO 1ª</abbr></th>
                <th><abbr title="Bonificación ofensiva con el arma secundaria">BO 2ª</abbr></th>
                <th><abbr title="Maniobra y movimiento">MM</abbr></th>
                <th><abbr title="Habilidades generales">HG</abbr></th>
                <th><abbr title="Acechar y esconderse">Acech. Escond.</abbr></th>
                <th><abbr title="Abrir cerraduras / Desactivar trampas">Cerrad./Tramp.</abbr></th>
                <th><abbr title="Percepción">Per.</abbr></th>
                <th><abbr title="Leer runas">Runas</abbr>/<abbr title="Usar objetos">Usar</abbr></th>
                <th><abbr title="Bonificación sortilegios base (Cantidad de listas de sortilegios)">Sort. (#)</abbr></th>
                <th><span title="Bonificación por habilidad de Oficio relacionada">Oficio</span></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {{ npc.prof?.label }}
                    <span v-if="npc.job?.label">/ {{ npc.job?.label }}</span>
                </td>
                <td>{{ npc.level }}</td>
                <td>
                    <abbr :title="$root.getItem('armor').name">{{ stats?.armor?.toUpperCase() }}</abbr>
                    ({{ stats.bd }}<abbr title="Escudo (+25)" v-if="shield.includes('shield')">e</abbr><abbr title="Puede incrementarse por hechizos" v-if="shield.includes('magic')">*</abbr>)
                </td>
                <td>{{ stats.hp }}</td>
                <td>{{ stats.pp }}</td>
                <td>{{ stats.ob1 }}<abbr :title="npc.atk1?.label">{{ npc.atk1?.id }}</abbr></td>
                <td>{{ stats.ob2 }}<abbr :title="npc.atk2?.label">{{ npc.atk2?.id }}</abbr></td>
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
            npc: {},
            stats: {},
            baseStats: {}
        }
    },
    props: ['data', 'levelMax', 'variation', 'shield'],
    inject: ['items', 'defs'],
    methods: {
        /**
         * @param {String} name
         * @param {(Object|Number[])} stat
         */
        getStatValue(name, stat) {
            if (stat instanceof Array) {
                // stat = [min, max, px, py]
                const range = stat[1] - stat[0];
                let v;
                if (stat.length <= 2) {
                    v = stat[0];
                } else {
                    const points = {
                        x: [0, stat[2], 1],
                        y: [0, stat[3], 1]
                    };
                    v = bezier(this.npc.level / this.levelMax, points) * range + stat[0];
                }

                if (this.variation) {
                    v += range * random(-1, 1) * (this.variation / 100);
                }

                const raceDef = this.defs.value.races[this.npc.race.id];
                if (raceDef) {
                    const raceStat = raceDef.stats[name];
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
                    if (key > this.npc.level) {
                        break;
                    }
                    v = value;
                }
                return v;
            }
        },

        fill(npc) {
            this.npc = npc;
            const perc = npc.level / this.levelMax;
            const stats = this.data[npc.prof.id];
            Object.keys(stats).forEach(n => {
                this.baseStats[n] = this.getStatValue(n, stats[n]);
                this.stats[n] = this.baseStats[n];
            });
        },

        reset() {
            Object.keys(this.stats).forEach(n => {
                this.stats[n] = this.baseStats[n] || 0;
            });
        },

        applyItems() {
            if (!this.npc.race) {
                return;
            }
            const raceDef = this.defs.value.races[this.npc.race.id];
            this.items.value.forEach(item => {
                let v = (this.baseStats[item.stat] || 0) + item.bonus;
                if (raceDef) {
                    const raceStat = raceDef.stats[item.stat];
                    if (raceStat && typeof raceStat !== 'number') {
                        for (const [key, value] of Object.entries(raceStat)) {
                            v += value[this.baseStats[key]];
                        }
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
            this.baseStats[name] = this.getStatValue(name, this.data[this.npc.prof.id][name]);
            this.stats[name] = this.baseStats[name];
        }
    },

    created() {
        watch(this.items, () => {
            this.reset();
            this.applyItems();
        });
    }
};
</script>
