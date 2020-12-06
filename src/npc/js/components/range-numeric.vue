<template>
    <label :for="id">{{ title }}</label>
    <input type="number" :id="id" :min="min" :max="max"
            v-model="start">
    a
    <input type="number" :max="max"
            v-model="end"
            :min="start"
            :disabled="!hasRange">
    <input type="checkbox" :id="id + '-range'"
            v-model="hasRange">
    <label :for="id + '-range'" :title="'Genera un número al azar entre ' + min + ' y ' + max">Rango</label>
</template>

<script>
import { randomInt } from '@utils/random.js'

export default {
    props: {
        id: String,
        title: String,
        min: Number,
        max: Number,
        range: Boolean,
        modelValue: Array
    },

    data() {
        return {
            hasRange: this.range
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
            let r2 = this.hasRange ? this.end : this.start;
            return randomInt(this.start, r2);
        }
    }
};
</script>
