<template>
    <label :for="id">{{ title }}</label>
    <input type="number" :id="id" :min="min" :max="max"
            v-model="start"
            :disabled="isRandom">
    a
    <input type="number" :max="max"
            v-model="end"
            :min="start"
            :disabled="isRandom">
    <template v-if="random">
        <input type="checkbox" :id="id + '-random'"
                v-model="isRandom">
        <label :for="id + '-random'" :title="'Genera un número al azar entre ' + min + ' y ' + max">Aleatorio</label>
    </template>
</template>

<script>
import { randomInt } from '@utils/random.js'

export default {
    props: {
        id: String,
        title: String,
        min: Number,
        max: Number,
        modelValue: Array,
        random: Boolean
    },

    data() {
        return {
            isRandom: false
        };
    },

    computed: {
        start: {
            get() {
                return this.modelValue[0];
            },
            set(value) {
                this.$emit('update:modelValue', [parseInt(value, 10), this.end]);
            }
        },
        end: {
            get() {
                return this.modelValue[1];
            },
            set(value) {
                this.$emit('update:modelValue', [this.start, parseInt(value, 10)]);
            }
        }
    },

    watch: {
        start(newValue, oldValue) {
            this.end = Math.max(this.end, newValue);
        }
    },

    methods: {
        getValue() {
            let r1 = this.isRandom ? this.min : this.start;
            let r2 = this.isRandom ? this.max : this.end;
            return randomInt(r1, r2);
        }
    }
};
</script>
