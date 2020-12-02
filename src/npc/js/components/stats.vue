<template>
    <table>
        <thead>
            <tr>
                <th>Profesión</th>
                <th><abbr title="Nivel">#</abbr></th>
                <th><abbr title="Tipo de armadura (Bonificación defensiva)">TA (BD)</abbr></th>
                <th><abbr title="Puntos de vida">Pv</abbr></th>
                <th><abbr title="Puntos de poder">PP</abbr></th>
                <th><abbr title="Bonificación ofensiva con el Arma principal">BO 1ª</abbr></th>
                <th><abbr title="Bonificación ofensiva con el Arma secundaria">BO 2ª</abbr></th>
                <th><abbr title="Maniobra y movimiento">MM</abbr></th>
                <th><abbr title="Habilidades generales">HG</abbr></th>
                <th><abbr title="Acechar y esconderse">Acech. Escond.</abbr></th>
                <th><abbr title="Abrir cerraduras / Desactivar trampas">Cerrad./Tramp.</abbr></th>
                <th><abbr title="Percepción">Per.</abbr></th>
                <th><abbr title="Leer runas">Runas</abbr>/<abbr title="Usar objetos">Usar</abbr></th>
                <th><abbr title="Bonificación sortilegios base (cantidad de listas de sortilegios)">Sort. (#)</abbr></th>
                <th><span title="Bonificación por habilidad de Oficio relacionada">Oficio</span></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {{ npc.prof.label }}
                    <span v-if="npc.job.label">/ {{ npc.job.label }}</span>
                </td>
                <td>{{ npc.level }}</td>
                <td>
                    {{ stats.ta }}
                    ({{ stats.bd }}<abbr title="Escudo (+25)" v-if="shield.includes('shield')">e</abbr><abbr title="Puede incrementarse por hechizos" v-if="shield.includes('magic')">*</abbr>)
                </td>
                <td>{{ stats.hp }}</td>
                <td>{{ stats.pp }}</td>
                <td>{{ stats.ob1 }}<abbr :title="npc.atk1.label">{{ npc.atk1.id }}</abbr></td>
                <td>{{ stats.ob2 }}<abbr :title="npc.atk2.label">{{ npc.atk2.id }}</abbr></td>
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
import { log } from 'util';

function bezier(t, points) {
    const x = bezier3(t, ...points.x);
    return bezier3(x, ...points.y);
}

function getValueForLevel(level, stat) {
    if (stat.length === 1) {
        return stat[0];
    }
    const points = {
        x: [0, stat[2], 1],
        y: [0, stat[3], 1]
    };
    const v = bezier(level, points) * (stat[1] - stat[0]) + stat[0];
    return v.toFixed();
}

export default {
    data() {
        return {
            stats: {},
            baseStats: {}
        }
    },
    props: ['data', 'npc', 'levelMax', 'variation', 'shield'],
    inject: ['items'],
    methods: {
        fill() {
            const level = this.npc.level / this.levelMax;
            const stats = this.data[this.npc.prof.id];
            Object.keys(stats).forEach(n => {
                this.baseStats[n] = getValueForLevel(level, stats[n]);
                this.stats[n] = this.baseStats[n];
            });
            this.applyItems();
        },

        reset() {
            Object.keys(this.stats).forEach(n => {
                this.stats[n] = this.baseStats[n] || 0;
            });
        },

        applyItems() {
            this.items.value.forEach(item => {
                this.stats[item.mod] = (this.baseStats[item.mod] || 0) + item.bonus;
            })
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
